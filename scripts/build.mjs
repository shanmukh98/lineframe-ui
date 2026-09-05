import { readFile, rm } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import * as esbuild from "esbuild";
import { generateIcons, copyWebsiteAssets } from "./assets.mjs";
import { root, sourceFiles } from "./files.mjs";

const watching = process.argv.includes("--watch");
const { version } = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const banner = `/* Lineframe UI v${version} | MIT | Generated from src/; do not edit. */`;
if (!watching) await rm(path.join(root, "dist"), { recursive: true, force: true });
async function discoverEntries() {
  return {
    scripts: (await sourceFiles(path.join(root, "src"), ".ts")).filter(
      (filename) => !filename.includes(`${path.sep}entries${path.sep}`),
    ),
    styles: (await sourceFiles(path.join(root, "src/styles"), ".css")).filter(
      (filename) => filename !== path.join(root, "src/styles/index.css"),
    ),
  };
}
const { scripts, styles } = await discoverEntries();
let initializing = true;
const refreshWebsite = {
  name: "refresh-website-assets",
  setup(build) {
    build.onEnd(async (result) => {
      if (!initializing && result.errors.length === 0) await copyWebsiteAssets();
    });
  },
};
const common = {
  absWorkingDir: root,
  logLevel: "warning",
  legalComments: "eof",
  plugins: watching ? [refreshWebsite] : [],
};
const builds = [
  {
    ...common,
    entryPoints: scripts,
    outbase: "src",
    outdir: "dist",
    format: "esm",
    platform: "browser",
    target: "es2020",
    sourcemap: true,
    banner: { js: banner },
  },
  {
    ...common,
    entryPoints: { lineframe: "src/entries/auto.ts" },
    outdir: ".",
    bundle: true,
    format: "iife",
    globalName: "Lineframe",
    target: "es2020",
    minify: true,
    sourcemap: true,
    banner: { js: banner },
  },
  {
    ...common,
    entryPoints: {
      "lineframe-theme": "src/entries/theme.ts",
      "lineframe-toc": "src/entries/toc.ts",
    },
    outdir: ".",
    bundle: true,
    format: "iife",
    target: "es2020",
    minify: true,
    sourcemap: true,
    banner: { js: banner },
  },
  {
    ...common,
    entryPoints: {
      lineframe: "src/styles/index.css",
      "lineframe-accents": "src/styles/tokens/accents.css",
    },
    outdir: ".",
    bundle: true,
    banner: { css: banner },
  },
  {
    ...common,
    entryPoints: styles,
    outbase: "src/styles",
    outdir: "dist/styles",
    bundle: true,
    banner: { css: banner },
  },
];
const contexts = [];
for (const options of builds) {
  if (watching) {
    const context = await esbuild.context(options);
    await context.rebuild();
    contexts.push(context);
  } else await esbuild.build(options);
}
await generateIcons();
await copyWebsiteAssets();
initializing = false;
console.log(`Built Lineframe ${version}: styles, browser entries, modules, and icons.`);

if (watching) {
  for (const context of contexts) await context.watch();
  let refresh = Promise.resolve();
  const sources = watch(path.join(root, "src"), { recursive: true }, (event, filename) => {
    if (event !== "rename" && !filename?.endsWith(".svg")) return;
    refresh = refresh
      .then(async () => {
        if (event === "rename") {
          const entries = await discoverEntries();
          for (const [index, entryPoints] of [
            [0, entries.scripts],
            [4, entries.styles],
          ]) {
            const options = builds[index];
            const previous = options.entryPoints;
            if (JSON.stringify(previous) === JSON.stringify(entryPoints)) continue;
            await contexts[index].dispose();
            options.entryPoints = entryPoints;
            contexts[index] = await esbuild.context(options);
            await contexts[index].watch();
            for (const removed of previous.filter((file) => !entryPoints.includes(file))) {
              const extension = index === 0 ? ".js" : ".css";
              const relative = path.relative(path.join(root, options.outbase), removed);
              const output = path.join(
                root,
                options.outdir,
                relative.replace(/\.(ts|css)$/, extension),
              );
              await rm(output, { force: true });
              if (options.sourcemap) await rm(`${output}.map`, { force: true });
            }
          }
        }
        if (!filename || filename.endsWith(".svg")) {
          await generateIcons();
          await copyWebsiteAssets();
        }
      })
      .catch((error) => {
        console.error(error);
        process.exitCode = 1;
      });
  });
  const shutdown = async () => {
    sources.close();
    await refresh;
    for (const context of contexts) await context.dispose();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  console.log("Watching library sources.");
}
