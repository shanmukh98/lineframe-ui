import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { settle } from "./fixture.mjs";

const output = fileURLToPath(new URL("../../website/dist/", import.meta.url));
const pages = readdirSync(output, { recursive: true })
  .filter((file) => file.endsWith("index.html"))
  .map((file) => file.replaceAll("\\", "/").replace(/index\.html$/, ""));

test("the favicon is fingerprinted and shares the header artwork", async ({
  page,
  request,
  baseURL,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto(baseURL);
  const href = await page.locator('link[rel="icon"]').getAttribute("href");
  const iconUrl = new URL(href, baseURL);
  expect(iconUrl.origin).toBe(new URL(baseURL).origin);
  expect(iconUrl.pathname).toMatch(/\/favicon\.[^/]+\.svg$/);
  const response = await request.get(iconUrl.href);
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("image/svg+xml");
  const paths = await page.evaluate(
    (source) => {
      const svg = new DOMParser().parseFromString(source, "image/svg+xml");
      return [...svg.querySelectorAll("path")].map((path) => path.getAttribute("d"));
    },
    await response.text(),
  );
  expect(paths).toHaveLength(2);
  expect(
    await page
      .locator(".site-header .site-brand-mark path")
      .evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))),
  ).toEqual(paths);
  await expect(page.locator(".site-brand-mark")).toHaveAttribute("aria-hidden", "true");
  await settle(page);
  const lightColor = await page
    .locator(".site-brand-mark")
    .evaluate((svg) => getComputedStyle(svg).color);
  await page.locator("[data-lineframe-theme-toggle]").first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await settle(page);
  const colors = await page
    .locator(".site-brand-mark")
    .evaluate((svg) => [getComputedStyle(svg).color, getComputedStyle(svg.closest("a")).color]);
  expect(colors[0]).toBe(colors[1]);
  expect(colors[0]).not.toBe(lightColor);
});

test("documentation pages, local links, and metadata are complete", async ({
  page,
  request,
  baseURL,
}) => {
  test.setTimeout(180000);
  expect(pages.length).toBeGreaterThanOrEqual(12);
  const targets = new Set();
  for (const route of pages) {
    const response = await page.goto(new URL(route, baseURL).href);
    expect(response?.ok(), route).toBe(true);
    await settle(page);
    await expect(page.getByRole("main")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length, route).toBeGreaterThan(20);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route,
    ).toBe(true);
    const hrefs = await page
      .locator("a[href]")
      .evaluateAll((links) => links.map((link) => link.href));
    for (const href of hrefs) {
      const url = new URL(href);
      if (
        url.origin === new URL(baseURL).origin &&
        url.pathname.startsWith(new URL(baseURL).pathname)
      ) {
        url.hash = "";
        targets.add(url.href);
      }
    }
  }
  for (const target of targets) {
    const response = await request.get(target);
    expect(response.ok(), target).toBe(true);
  }
});

for (const mode of ["light", "dark"]) {
  test(`documentation remains accessible and readable in ${mode} mode`, async ({
    page,
    baseURL,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== "chromium",
      "Full axe sweep uses Chromium; shared behavior runs in all engines.",
    );
    test.setTimeout(240000);
    await page.emulateMedia({ colorScheme: mode });
    for (const route of pages) {
      await page.goto(new URL(route, baseURL).href);
      await settle(page);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations, route).toEqual([]);
    }
  });
}

test("documentation reflows at 320px", async ({ page, baseURL }) => {
  test.setTimeout(120000);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of pages) {
    await page.goto(new URL(route, baseURL).href);
    await settle(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      route,
    ).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("credits name the actual inspiration without suggesting affiliation", async ({ page }) => {
  await page.goto("docs/philosophy/");
  await expect(page.locator('main a[href="https://cobanov.dev/"]')).toBeVisible();
  await expect(page.locator('main a[href="https://tv.cobanov.dev/"]')).toBeVisible();
  await expect(page.locator("#typeface-credits + p")).toContainText(
    "uses Geist and Geist Mono, by the Geist Project Authors",
  );
});

test("copy controls report success and a usable denied-permission fallback", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          document.documentElement.dataset.copiedExample = text;
        },
      },
    });
  });
  await page.goto("docs/installation/");
  const button = page.locator("[data-copy-code]").first();
  await expect(button).toBeVisible();
  const id = await button.getAttribute("data-copy-code");
  const code = await page.locator(`#${id}`).textContent();
  await button.click();
  await expect(page.locator("html")).toHaveAttribute("data-copied-example", code);
  await expect(button.locator("[data-copy-label]")).toHaveText("Copied");
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {
      throw new DOMException("Copy denied", "NotAllowedError");
    };
  });
  await button.click();
  await expect(button.locator("[data-copy-label]")).toHaveText("Select code");
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(code);
});

test("form demos validate and reset locally", async ({ page }) => {
  await page.goto("docs/components/forms/");
  await page.getByLabel("Project name (required)", { exact: true }).fill("Example project");
  await page.getByRole("button", { name: "Check example", exact: true }).click();
  await expect(
    page.locator("[data-demo-form]").first().locator("[data-demo-status]"),
  ).toContainText("no data was sent");
  await expect(page).not.toHaveURL(/\?/);
  await page.getByRole("button", { name: "Reset fields", exact: true }).click();
  await expect(page.getByLabel("Project name (required)", { exact: true })).toHaveValue("");
  await page.getByLabel("Email (required)", { exact: true }).fill("reader@example.com");
  await expect(page.getByLabel("Email (required)", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "false",
  );
  await expect(page.locator("#sample-email-error")).toBeHidden();
});

test.describe("native documentation navigation", () => {
  test.use({ javaScriptEnabled: false });
  test("mobile readers can navigate without JavaScript", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto("docs/installation/");
    const menu = page.locator(".docs-nav-mobile");
    await menu.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(menu).toHaveAttribute("open", "");
    await page.getByRole("link", { name: "Forms", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Forms", exact: true })).toBeVisible();
  });
});
