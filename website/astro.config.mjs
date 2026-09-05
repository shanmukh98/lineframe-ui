import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://shanmukh98.github.io",
  base: "/lineframe-ui",
  trailingSlash: "always",
  output: "static",
  // Preserve word spacing around line-wrapped inline markup.
  compressHTML: false,
  outDir: "./dist",
  markdown: {
    syntaxHighlight: false,
  },
});
