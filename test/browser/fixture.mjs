import { expect } from "@playwright/test";

export async function settle(page) {
  // Firefox suspends page-owned promises when JavaScript is disabled.
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.fonts.status === "loaded" &&
          document.getAnimations().every((animation) => animation.playState !== "running"),
      ),
    )
    .toBe(true);
}

export async function fixture(page, baseURL) {
  const url = new URL("__fixture__", baseURL).href;
  await page.route(url, (route) =>
    route.fulfill({
      contentType: "text/html",
      body: `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lineframe regression fixture</title>
  <script src="${baseURL}assets/lineframe.js"></script>
  <link rel="stylesheet" href="${baseURL}assets/lineframe.css">
</head>
<body class="lf-site" data-lineframe-accent="slate">
  <a class="lf-skip-link" href="#main">Skip to content</a>
  <header class="lf-header"><div class="lf-header__inner">
    <a class="lf-brand" href="#main">Lineframe</a>
    <button class="lf-theme-toggle" data-lineframe-theme-toggle type="button">
      <span class="lf-theme-toggle__mark" aria-hidden="true"></span>
      <span data-lineframe-theme-label>Dark</span>
    </button>
  </div></header>
  <main id="main" class="lf-article" tabindex="-1">
    <div class="lf-article__layout" data-lineframe-article>
      <header class="lf-article__header">
        <p class="lf-kicker">Reusable interfaces</p>
        <h1 class="lf-article__title">A content-first interface</h1>
        <div class="lf-cluster">
          <span class="lf-tag" data-testid="page-tag">Page accent</span>
          <span data-lineframe-accent="clay"><span class="lf-tag" data-testid="scoped-tag">Scoped accent</span></span>
          <button class="lf-button" type="button" data-lineframe-theme-reset>Follow system</button>
        </div>
      </header>
      <aside class="lf-article__rail">
        <nav class="lf-toc" data-lineframe-toc aria-label="On this page" hidden>
          <p class="lf-toc__title">On this page</p>
          <button class="lf-toc__toggle" type="button" aria-expanded="false">
            <span>On this page</span><span class="lf-toc__toggle-mark" aria-hidden="true">+</span>
          </button>
          <ol class="lf-toc__list" data-lineframe-toc-list></ol>
        </nav>
      </aside>
      <div class="lf-article__body"><div class="lf-prose" data-lineframe-prose>
        <h2 id="introduction">Introduction</h2>
        <p>Readable defaults and native controls.</p>
        <div class="lf-stack">
          <div class="lf-field">
            <label class="lf-label" for="reader-name">Reader name</label>
            <input class="lf-input" id="reader-name" aria-describedby="reader-hint" autocomplete="name">
            <p class="lf-hint" id="reader-hint">Use a name you want displayed.</p>
          </div>
          <div class="lf-field">
            <label class="lf-label" for="reader-email">Email</label>
            <input class="lf-input" id="reader-email" type="email" value="incomplete" aria-invalid="true" aria-describedby="email-error">
            <p class="lf-error-text" id="email-error">Enter a complete email address.</p>
          </div>
          <label class="lf-choice"><input class="lf-checkbox" type="checkbox">Show summaries</label>
          <button class="lf-button lf-button--solid" disabled>Unavailable action</button>
          <details class="lf-disclosure"><summary>More information</summary><p>Native disclosure content.</p></details>
          <div class="lf-alert lf-alert--success"><p class="lf-alert__title">Saved</p><p>Your local changes are ready.</p></div>
        </div>
        <div style="min-block-size:32rem"></div>
        <h2>Details</h2>
        <p>Heading IDs can be generated.</p>
        <h3>Details</h3>
        <p>Repeated labels still get unique targets.</p>
        <div style="min-block-size:32rem"></div>
        <h2 id="results">Results</h2>
        <p>This short final section cannot always reach the header threshold.</p>
      </div></div>
    </div>
  </main>
  <footer class="lf-footer"><div class="lf-footer__inner">Lineframe fixture</div></footer>
</body></html>`,
    }),
  );
  await page.goto(url);
  await settle(page);
}
