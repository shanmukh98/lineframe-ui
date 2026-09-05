import type { Theme } from "../../types.js";

export const storageKey = "lineframe-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveTheme(preference: Theme | null, prefersDark: boolean): Theme {
  return preference ?? (prefersDark ? "dark" : "light");
}

export function parsePreference(value: string | null): Theme | null {
  if (value === null || isTheme(value)) return value;
  console.warn("[Lineframe] Ignoring an unsupported saved theme.");
  return null;
}

function unavailable(error: unknown): boolean {
  return (
    error instanceof DOMException &&
    (error.name === "SecurityError" || error.name === "QuotaExceededError")
  );
}

export function isPreferenceStorage(storage: Storage | null): boolean {
  try {
    return storage === window.localStorage;
  } catch (error) {
    if (!unavailable(error)) throw error;
    console.warn("[Lineframe] Theme storage is unavailable; ignoring storage synchronization.");
    return false;
  }
}

export function readPreference(): Theme | null {
  try {
    return parsePreference(window.localStorage.getItem(storageKey));
  } catch (error) {
    if (!unavailable(error)) throw error;
    console.warn("[Lineframe] Theme storage is unavailable; using the system preference.");
    return null;
  }
}

export function writePreference(theme: Theme | null): void {
  try {
    if (theme === null) window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, theme);
  } catch (error) {
    if (!unavailable(error)) throw error;
    console.warn("[Lineframe] Theme preference could not be saved; it still applies to this page.");
  }
}
