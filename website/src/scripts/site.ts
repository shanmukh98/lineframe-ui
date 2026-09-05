export function initSite() {
  document.querySelectorAll<HTMLButtonElement>("[data-copy-code]").forEach((button) => {
    const code = document.getElementById(button.dataset.copyCode ?? "");
    if (!code) {
      console.warn("[Lineframe docs] A copy button is missing its code example.");
      return;
    }

    const status = button
      .closest(".code-toolbar")
      ?.querySelector<HTMLElement>("[data-copy-status]");
    const label = button.querySelector<HTMLElement>("[data-copy-label]");
    const selectCode = () => {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(code);
        selection.removeAllRanges();
        selection.addRange(range);
        if (status) status.textContent = "Code selected. Press Ctrl+C or Command+C.";
      } else if (status) {
        status.textContent = "Clipboard unavailable. Select the code to copy it.";
      }
      if (label) label.textContent = "Select code";
    };
    button.hidden = false;

    button.addEventListener("click", async () => {
      if (!navigator.clipboard?.writeText) {
        selectCode();
        return;
      }
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(code.textContent ?? "");
        if (label) label.textContent = "Copied";
        if (status) status.textContent = "Copied to clipboard.";
      } catch (error) {
        if (!(
          error instanceof DOMException &&
          ["NotAllowedError", "SecurityError", "AbortError"].includes(error.name)
        ))
          throw error;
        selectCode();
      } finally {
        button.disabled = false;
      }
    });
  });

  document.querySelectorAll<HTMLElement>("[data-palette-preview]").forEach((preview) => {
    const controls = preview.querySelector<HTMLElement>("[data-preview-controls]");
    const status = preview.querySelector<HTMLOutputElement>("[data-palette-status]");
    if (!controls) return;
    controls.hidden = false;

    controls.querySelectorAll<HTMLInputElement>('input[name="preview-accent"]').forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked || !["slate", "violet", "moss", "clay"].includes(radio.value)) return;
        preview.dataset.lineframeAccent = radio.value;
        if (status) status.textContent = `${radio.value} palette · preview only`;
      });
    });
  });

  document.querySelectorAll<HTMLFormElement>("[data-demo-form]").forEach((form) => {
    const status = form.querySelector<HTMLElement>("[data-demo-status]");
    const validateFields = () => {
      form.querySelectorAll<HTMLInputElement>("[data-demo-error]").forEach((input) => {
        const error = document.getElementById(input.dataset.demoError ?? "");
        const invalid = !input.validity.valid;
        input.setAttribute("aria-invalid", String(invalid));
        if (error) {
          error.hidden = !invalid;
          const descriptions = (input.getAttribute("aria-describedby") ?? "")
            .split(/\s+/)
            .filter((id) => id && id !== error.id);
          if (invalid) descriptions.push(error.id);
          input.setAttribute("aria-describedby", descriptions.join(" "));
        }
      });
    };

    form.addEventListener("input", () => {
      validateFields();
      if (status) status.textContent = "";
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      validateFields();
      if (!form.reportValidity()) return;
      if (status) status.textContent = "Example checked. Everything is valid; no data was sent.";
    });
    form.addEventListener("reset", () => {
      queueMicrotask(() => {
        validateFields();
        if (status) status.textContent = "Fields reset to their starting values. No data was sent.";
      });
    });
  });

  const themeOutputs = document.querySelectorAll<HTMLOutputElement>("[data-theme-status]");
  if (themeOutputs.length) {
    const updateThemeStatus = () => {
      const root = document.documentElement;
      const mode = root.dataset.theme;
      const preference = root.dataset.lineframeThemePreference;
      themeOutputs.forEach((output) => {
        output.textContent = mode
          ? `${mode === "dark" ? "Dark" : "Light"} theme · ${preference === "system" ? "following your system" : "your saved choice"}`
          : "Following your system preference";
      });
    };
    updateThemeStatus();
    new MutationObserver(updateThemeStatus).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-lineframe-theme-preference"],
    });
  }
}
