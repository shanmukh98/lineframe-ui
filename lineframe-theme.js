(() => {
  const storageKey = "lineframe-theme";
  const root = document.documentElement;
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)");

  const getStoredTheme = () => {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : null;
    } catch {
      return null;
    }
  };

  const storeTheme = (theme) => {
    try {
      window.localStorage.setItem(storageKey, theme);
    } catch {
      // The selected theme still applies for this page when storage is unavailable.
    }
  };

  const clearStoredTheme = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Nothing else is required when storage is unavailable.
    }
  };

  const systemTheme = () => (systemPreference.matches ? "dark" : "light");

  const updateControls = (theme) => {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.querySelectorAll("[data-lineframe-theme-toggle]").forEach((button) => {
      button.dataset.currentTheme = theme;
      button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      button.setAttribute("title", `Switch to ${nextTheme} theme`);

      const label = button.querySelector("[data-lineframe-theme-label]");
      if (label) label.textContent = nextTheme[0].toUpperCase() + nextTheme.slice(1);
    });
  };

  const updateThemeColor = (theme) => {
    const meta = document.querySelector("[data-lineframe-theme-color]");
    if (meta) meta.setAttribute("content", theme === "dark" ? "#10110f" : "#f4f3ee");
  };

  const applyTheme = (theme, persist = false) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    updateControls(theme);
    updateThemeColor(theme);
    if (persist) storeTheme(theme);
  };

  const initializeControls = () => {
    updateControls(root.dataset.theme || systemTheme());
    updateThemeColor(root.dataset.theme || systemTheme());

    document.querySelectorAll("[data-lineframe-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme, true);
      });
    });
  };

  applyTheme(getStoredTheme() || systemTheme());

  systemPreference.addEventListener("change", () => {
    if (!getStoredTheme()) applyTheme(systemTheme());
  });

  window.LineframeTheme = {
    current: () => root.dataset.theme,
    set: (theme) => {
      if (theme === "light" || theme === "dark") applyTheme(theme, true);
    },
    reset: () => {
      clearStoredTheme();
      applyTheme(systemTheme());
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeControls, { once: true });
  } else {
    initializeControls();
  }
})();
