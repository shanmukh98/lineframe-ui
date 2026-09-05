import { site } from "../lib/site";

export const cdnInstall = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your project</title>
    <script src="${site.cdn}/lineframe.js"></script>
    <link rel="stylesheet" href="${site.cdn}/lineframe.css">
  </head>
  <body class="lf-site" data-lineframe-accent="slate">
    <main class="lf-container">
      <div class="lf-prose">
        <h1>A place to begin.</h1>
        <p>Your content, with a little structure.</p>
      </div>
    </main>
  </body>
</html>`;

export const cdnHead = `<script src="${site.cdn}/lineframe.js"></script>
<link rel="stylesheet" href="${site.cdn}/lineframe.css">`;

export const moduleInstall = `import '@shanmukh98/lineframe-ui/styles.css';
import { initTheme, initToc } from '@shanmukh98/lineframe-ui';

// Run after your page or component has mounted.
const theme = initTheme();
const destroyToc = initToc();

// Call from your application's teardown lifecycle.
function unmount() {
  destroyToc();
  theme.destroy();
}`;

export const selfHostedInstall = `<script src="./assets/lineframe.js"></script>
<link rel="stylesheet" href="./assets/lineframe.css">
<!-- Use a path that resolves from each page on your own site. -->`;

export const legacyInstall = `<script src="${site.cdn}/lineframe-theme.js"></script>
<link rel="stylesheet" href="${site.cdn}/lineframe.css">
<script src="${site.cdn}/lineframe-toc.js" defer></script>`;
