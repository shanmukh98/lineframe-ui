import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { fixture, settle } from "./fixture.mjs";

for (const mode of ["light", "dark"]) {
  test.describe(`${mode} library`, () => {
    test.use({ colorScheme: mode });

    test("theme choice persists, resets, and follows later system changes", async ({
      page,
      baseURL,
    }) => {
      await fixture(page, baseURL);
      const other = mode === "light" ? "dark" : "light";
      await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
      await page.getByRole("button", { name: `Switch to ${other} theme` }).click();
      await page.reload();
      await expect(page.locator("html")).toHaveAttribute("data-theme", other);
      await page.emulateMedia({ colorScheme: mode });
      await expect(page.locator("html")).toHaveAttribute("data-theme", other);
      await page.getByRole("button", { name: "Follow system" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", mode);
      await page.emulateMedia({ colorScheme: other });
      await expect(page.locator("html")).toHaveAttribute("data-theme", other);
    });

    test("palettes update rendered colors without leaking into nested scopes", async ({
      page,
      baseURL,
    }) => {
      await fixture(page, baseURL);
      const nested = await page
        .getByTestId("scoped-tag")
        .evaluate((el) => getComputedStyle(el).backgroundColor);
      const backgrounds = new Set();
      for (const palette of ["slate", "violet", "moss", "clay"]) {
        await page.locator("body").evaluate((el, value) => {
          el.dataset.lineframeAccent = value;
        }, palette);
        await settle(page);
        backgrounds.add(
          await page.getByTestId("page-tag").evaluate((el) => getComputedStyle(el).backgroundColor),
        );
        expect(
          await page
            .getByTestId("scoped-tag")
            .evaluate((el) => getComputedStyle(el).backgroundColor),
        ).toBe(nested);
      }
      expect(backgrounds.size).toBe(4);
    });

    test("native controls and small layouts retain semantics and focus", async ({
      page,
      baseURL,
    }) => {
      await page.setViewportSize({ width: 320, height: 800 });
      await fixture(page, baseURL);
      await page.getByLabel("Reader name", { exact: true }).fill("Reader");
      await expect(page.getByLabel("Reader name", { exact: true })).toHaveValue("Reader");
      await expect(page.getByRole("button", { name: "Unavailable action" })).toBeDisabled();
      await page.getByLabel("Show summaries").focus();
      await page.keyboard.press("Space");
      await expect(page.getByLabel("Show summaries")).toBeChecked();
      await page.getByText("More information", { exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(page.getByText("Native disclosure content.")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(results.violations).toEqual([]);
    });
  });
}

test("TOC reaches the final section and cleans up without duplicating listeners", async ({
  page,
  baseURL,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await fixture(page, baseURL);
  const toc = page.locator("[data-lineframe-toc]");
  const count = await toc.getByRole("link").count();
  expect(count).toBe(4);
  expect(
    await toc
      .getByRole("link")
      .evaluateAll((links) => new Set(links.map((link) => link.hash)).size),
  ).toBe(count);
  await toc.getByRole("link", { name: "Results", exact: true }).click();
  await page.waitForFunction(
    () => scrollY + innerHeight >= document.documentElement.scrollHeight - 1,
  );
  await expect(toc.locator('[aria-current="location"]')).toHaveText("Results");
  await page.reload();
  await settle(page);
  await expect(toc.locator('[aria-current="location"]')).toHaveText("Results");
  await page.evaluate(() => {
    const article = document.querySelector("[data-lineframe-article]");
    const stop = window.Lineframe.initToc(article);
    stop();
    stop();
    window.Lineframe.initToc(article);
    window.Lineframe.initToc(article);
  });
  expect(await toc.getByRole("link").count()).toBe(count);
  await toc.getByRole("link", { name: "Introduction", exact: true }).click();
  await expect(toc.locator('[aria-current="location"]')).toHaveText("Introduction");
});

test("mobile TOC collapse preserves heading alignment and keyboard context", async ({
  page,
  baseURL,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await fixture(page, baseURL);
  const toggle = page.getByRole("button", { name: "On this page", exact: true });
  await toggle.click();
  await page.getByRole("link", { name: "Results", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#results")).toBeFocused();
  await expect(page.locator("#results")).toHaveAttribute("tabindex", "-1");
  await expect(page.locator(".lf-toc__link[aria-current='location']")).toHaveText("Results");
  await page.keyboard.press("Tab");
  await expect(page.locator("#results")).not.toHaveAttribute("tabindex");
  await page.goBack();
  await expect(page).not.toHaveURL(/#results$/);
});

test("TOC cleanup restores temporary focus attributes", async ({ page, baseURL }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await fixture(page, baseURL);
  await page.getByRole("button", { name: "On this page", exact: true }).click();
  await page.getByRole("link", { name: "Results", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#results")).toBeFocused();
  await page.evaluate(() => window.Lineframe.initToc()());
  await expect(page.locator("#results")).not.toHaveAttribute("tabindex");
});

for (const removed of [0, 1]) {
  test(`shared article survives cleaning up TOC ${removed + 1} first`, async ({
    page,
    baseURL,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await fixture(page, baseURL);
    await page.evaluate((removed) => {
      window.Lineframe.initToc()();
      const article = document.querySelector("[data-lineframe-article]");
      article.style.setProperty("--lf-nav-height", "21px", "important");
      article.dataset.lineframeTocReady = "authored";
      const first = article.querySelector("[data-lineframe-toc]");
      const second = first.cloneNode(true);
      first.id = "toc-original";
      second.id = "toc-clone";
      first.after(second);
      const stops = [first, second].map((toc) => window.Lineframe.initToc(toc));
      stops[removed]();
      window.releaseRemainingToc = () => {
        stops[1 - removed]();
        stops[removed]();
      };
    }, removed);
    const article = page.locator("[data-lineframe-article]");
    await expect(article).toHaveAttribute("data-lineframe-toc-ready", "true");
    expect(await article.evaluate((el) => el.style.getPropertyValue("--lf-nav-height"))).not.toBe(
      "21px",
    );
    const surviving = page.locator(removed === 0 ? "#toc-clone" : "#toc-original");
    await surviving.getByRole("link", { name: "Details", exact: true }).first().click();
    await expect(page.locator("#details")).toBeInViewport();
    await expect(page).toHaveURL(/#details$/);
    await page.evaluate(() => window.releaseRemainingToc());
    await expect(page.locator("#details")).toHaveCount(0);
    await expect(article).toHaveAttribute("data-lineframe-toc-ready", "authored");
    expect(
      await article.evaluate((el) => [
        el.style.getPropertyValue("--lf-nav-height"),
        el.style.getPropertyPriority("--lf-nav-height"),
      ]),
    ).toEqual(["21px", "important"]);
  });
}

test("short TOC cleanup restores its authored visibility", async ({ page, baseURL }) => {
  await fixture(page, baseURL);
  const result = await page.evaluate(() => {
    window.Lineframe.initToc()();
    const toc = document.querySelector("[data-lineframe-toc]");
    const headings = document.querySelectorAll(
      "[data-lineframe-prose] h2, [data-lineframe-prose] h3",
    );
    [...headings].slice(1).forEach((heading) => heading.remove());
    toc.hidden = false;
    const stop = window.Lineframe.initToc(toc);
    const repeated = window.Lineframe.initToc(toc);
    const during = toc.hidden;
    stop();
    repeated();
    return { during, after: toc.hidden };
  });
  expect(result).toEqual({ during: true, after: false });
});

test("theme synchronization ignores session storage but follows local storage", async ({
  page,
  baseURL,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await fixture(page, baseURL);
  const states = await page.evaluate(async () => {
    window.LineframeTheme.set("dark");
    const iframe = document.createElement("iframe");
    iframe.srcdoc = "<!doctype html><title>Storage peer</title>";
    const loaded = new Promise((resolve) =>
      iframe.addEventListener("load", resolve, { once: true }),
    );
    document.body.append(iframe);
    await loaded;
    const change = (area, key, value) =>
      new Promise((resolve) => {
        const onStorage = (event) => {
          if (event.storageArea !== window[area] || event.key !== key) return;
          window.removeEventListener("storage", onStorage);
          resolve();
        };
        window.addEventListener("storage", onStorage);
        const storage = iframe.contentWindow[area];
        if (key === null) storage.clear();
        else storage.setItem(key, value);
      });
    await change("sessionStorage", "unrelated", "value");
    await change("sessionStorage", null);
    const afterSessionClear = window.LineframeTheme.current();
    const saved = localStorage.getItem("lineframe-theme");
    await change("localStorage", "lineframe-theme", "light");
    const afterLocalChange = window.LineframeTheme.current();
    await change("localStorage", "lineframe-theme", "dark");
    await change("localStorage", null);
    const afterLocalClear = window.LineframeTheme.current();
    iframe.remove();
    return { afterSessionClear, saved, afterLocalChange, afterLocalClear };
  });
  expect(states).toEqual({
    afterSessionClear: "dark",
    saved: "dark",
    afterLocalChange: "light",
    afterLocalClear: "light",
  });
});

test("blocked storage keeps manual theme choices usable", async ({ page, baseURL }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage denied", "SecurityError");
      },
    });
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "light" });
  await fixture(page, baseURL);
  await page.getByRole("button", { name: "Switch to dark theme" }).click();
  await page.evaluate(() => window.dispatchEvent(new StorageEvent("storage", { key: null })));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(errors).toEqual([]);
});

test("theme initialization and cleanup are idempotent", async ({ page, baseURL }) => {
  await fixture(page, baseURL);
  expect(await page.evaluate(() => window.Lineframe.initTheme() === window.LineframeTheme)).toBe(
    true,
  );
  await page.evaluate(() => {
    const original = window.LineframeTheme;
    original.destroy();
    const next = window.Lineframe.initTheme();
    original.destroy();
    if (next !== window.LineframeTheme) throw new Error("Old cleanup affected the new controller.");
  });
  await expect(page.getByRole("button", { name: /Switch to .* theme/ })).toBeVisible();
  const before = await page.locator("html").getAttribute("data-theme");
  await page.getByRole("button", { name: /Switch to .* theme/ }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    before === "dark" ? "light" : "dark",
  );
});

test("reduced motion and unrestricted zoom remain available", async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await fixture(page, baseURL);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    "auto",
  );
  const viewport = await page.locator('meta[name="viewport"]').getAttribute("content");
  expect(viewport).not.toMatch(/maximum-scale|user-scalable=no/);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, colorScheme: "dark" });
  test("system colors, content, and native disclosure remain usable", async ({ page, baseURL }) => {
    await fixture(page, baseURL);
    expect(await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
      "rgb(0, 0, 0)",
    );
    await expect(page.getByRole("heading", { name: "A content-first interface" })).toBeVisible();
    await expect(page.locator("[data-lineframe-toc]")).toBeHidden();
    await expect(page.locator("[data-lineframe-theme-toggle]")).toBeHidden();
    await page.getByText("More information", { exact: true }).click();
    await expect(page.getByText("Native disclosure content.")).toBeVisible();
  });
});
