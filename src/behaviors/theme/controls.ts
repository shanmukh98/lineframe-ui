import type { Theme } from "../../types.js";

export function updateControls(theme: Theme): void {
  const nextTheme = theme === "dark" ? "light" : "dark";
  for (const button of document.querySelectorAll<HTMLElement>("[data-lineframe-theme-toggle]")) {
    button.dataset.currentTheme = theme;
    button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    button.setAttribute("title", `Switch to ${nextTheme} theme`);
    const label = button.querySelector("[data-lineframe-theme-label]");
    if (label) label.textContent = nextTheme === "light" ? "Light" : "Dark";
  }

  const background = document.body ? getComputedStyle(document.body).backgroundColor : "";
  const color =
    background && background !== "rgba(0, 0, 0, 0)"
      ? background
      : theme === "dark"
        ? "#000000"
        : "#f4f3ee";
  document.querySelector("[data-lineframe-theme-color]")?.setAttribute("content", color);
}
