export type Theme = "light" | "dark";

export interface ThemeController {
  current(): Theme;
  set(theme: Theme): void;
  reset(): void;
  destroy(): void;
}

declare global {
  interface Window {
    LineframeTheme?: ThemeController;
  }
}
