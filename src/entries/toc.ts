import { initToc } from "../behaviors/toc/index.js";

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => initToc(), { once: true });
} else {
  initToc();
}
