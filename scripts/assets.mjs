import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { root, sourceFiles } from "./files.mjs";

export const browserFiles = [
  "lineframe.css",
  "lineframe-accents.css",
  "lineframe.js",
  "lineframe.js.map",
  "lineframe-theme.js",
  "lineframe-theme.js.map",
  "lineframe-toc.js",
  "lineframe-toc.js.map",
  "lineframe-icons.svg",
  "favicon.svg",
];

export async function generateIcons() {
  const files = await sourceFiles(path.join(root, "src/icons"), ".svg");
  if (files.length === 0) throw new Error("No icon source files were found.");
  const destination = path.join(root, "dist/icons");
  await mkdir(destination, { recursive: true });
  const symbols = [];
  const names = [];
  for (const file of files) {
    const name = path.basename(file, ".svg");
    const source = await readFile(file, "utf8");
    const svg = source.match(/<svg\b([^>]*)>([\s\S]*?)<\/svg>\s*$/);
    if (
      !/^[a-z][a-z0-9-]*$/.test(name) ||
      !svg ||
      !/viewBox="0 0 24 24"/.test(svg[1]) ||
      /<(?:script|foreignObject|style)\b|\bon\w+\s*=|\b(?:href|src)\s*=/i.test(source)
    ) {
      throw new Error(`Icon ${name} must be a static, self-contained 24px SVG.`);
    }
    symbols.push(
      `<symbol id="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${svg[2].trim()}</symbol>`,
    );
    names.push(name);
    await copyFile(file, path.join(destination, `${name}.svg`));
  }
  await writeFile(
    path.join(root, "lineframe-icons.svg"),
    `<!-- Generated from src/icons. Lineframe UI | MIT -->\n<svg xmlns="http://www.w3.org/2000/svg">\n${symbols.join("\n")}\n</svg>\n`,
  );
  await writeFile(path.join(destination, "manifest.json"), `${JSON.stringify(names, null, 2)}\n`);
}

export async function copyWebsiteAssets() {
  const destination = path.join(root, "website/public/assets");
  await mkdir(destination, { recursive: true });
  for (const filename of browserFiles) {
    await copyFile(path.join(root, filename), path.join(destination, filename));
  }
  await mkdir(path.join(destination, "icons"), { recursive: true });
  for (const file of await sourceFiles(path.join(root, "dist/icons"), ".svg")) {
    await copyFile(file, path.join(destination, "icons", path.basename(file)));
  }
  await copyFile(path.join(root, "dist/icons/manifest.json"), path.join(destination, "icons.json"));
}
