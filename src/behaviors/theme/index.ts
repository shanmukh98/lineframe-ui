import type { Theme, ThemeController } from "../../types.js";
import { updateControls } from "./controls.js";
import {
  isTheme,
  isPreferenceStorage,
  parsePreference,
  readPreference,
  resolveTheme,
  storageKey,
  writePreference,
} from "./preference.js";

export function initTheme(): ThemeController {
  if (typeof window === "undefined" || typeof document === "undefined") {
    throw new Error("Lineframe initTheme() must be called in a browser.");
  }
  if (window.LineframeTheme) {
    updateControls(window.LineframeTheme.current());
    return window.LineframeTheme;
  }

  const root = document.documentElement;
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const listeners = new AbortController();
  const { signal } = listeners;
  let preference = readPreference();
  let theme: Theme = resolveTheme(preference, system.matches);
  let destroyed = false;
  const assertActive = () => {
    if (destroyed) throw new Error("This theme controller was destroyed; call initTheme() again.");
  };

  const apply = () => {
    theme = resolveTheme(preference, system.matches);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    root.dataset.lineframeThemeReady = "true";
    root.dataset.lineframeThemePreference = preference ?? "system";
    updateControls(theme);
  };

  const controller: ThemeController = {
    current: () => theme,
    set(value) {
      assertActive();
      if (!isTheme(value)) throw new TypeError("Lineframe theme must be 'light' or 'dark'.");
      preference = value;
      apply();
      writePreference(value);
    },
    reset() {
      assertActive();
      preference = null;
      apply();
      writePreference(null);
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      listeners.abort();
      delete root.dataset.lineframeThemeReady;
      delete root.dataset.lineframeThemePreference;
      if (window.LineframeTheme === controller) delete window.LineframeTheme;
    },
  };
  window.LineframeTheme = controller;

  document.addEventListener(
    "click",
    (event) => {
      if (!(event.target instanceof Element)) return;
      if (event.target.closest("[data-lineframe-theme-reset]")) controller.reset();
      else if (event.target.closest("[data-lineframe-theme-toggle]")) {
        controller.set(theme === "dark" ? "light" : "dark");
      }
    },
    { signal },
  );
  system.addEventListener(
    "change",
    () => {
      if (preference === null) apply();
    },
    { signal },
  );
  window.addEventListener(
    "storage",
    (event) => {
      if (event.key !== storageKey && event.key !== null) return;
      if (!isPreferenceStorage(event.storageArea)) return;
      preference = parsePreference(event.newValue);
      apply();
    },
    { signal },
  );
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply, { once: true, signal });
  }
  apply();
  return controller;
}
