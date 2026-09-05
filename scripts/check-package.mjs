import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { root } from "./files.mjs";

const npmCLI = process.env.npm_execpath;
if (!npmCLI) throw new Error("Run this check with npm run check:package.");
const scratchRoot = path.join(root, "test-results");
await mkdir(scratchRoot, { recursive: true });
const scratch = await mkdtemp(path.join(scratchRoot, "package-"));
try {
  const output = execFileSync(
    process.execPath,
    [npmCLI, "pack", "--ignore-scripts", "--json", "--pack-destination", scratch],
    { cwd: root, encoding: "utf8" },
  );
  const [artifact] = JSON.parse(output);
  const names = new Set(artifact.files.map((file) => file.path));
  const required = [
    "dist/index.js",
    "dist/index.d.ts",
    "dist/styles/base.css",
    "dist/styles/components/forms.css",
    "dist/icons/check.svg",
    "dist/icons/manifest.json",
    "lineframe.css",
    "lineframe-accents.css",
    "lineframe.js",
    "lineframe.js.map",
    "lineframe-theme.js",
    "lineframe-toc.js",
    "lineframe-icons.svg",
    "LICENSE",
  ];
  for (const name of required) assert.ok(names.has(name), `Missing packaged asset: ${name}`);
  for (const name of names) {
    assert.ok(
      !/^(?:website|test|node_modules|src)\//.test(name),
      `Unexpected package content: ${name}`,
    );
  }

  await writeFile(
    path.join(scratch, "package.json"),
    JSON.stringify({ name: "lineframe-consumer-smoke", private: true, type: "module" }),
  );
  execFileSync(
    process.execPath,
    [
      npmCLI,
      "install",
      "--ignore-scripts",
      "--offline",
      "--no-audit",
      "--no-fund",
      path.join(scratch, artifact.filename),
    ],
    { cwd: scratch, stdio: "pipe" },
  );
  execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      `
    import assert from "node:assert/strict";
    import { readFileSync } from "node:fs";
    import { fileURLToPath } from "node:url";
    import { initTheme, initToc } from "@shanmukh98/lineframe-ui";
    assert.equal(typeof initTheme, "function");
    assert.equal(typeof initToc, "function");
    assert.equal(typeof window, "undefined");
    assert.throws(() => initTheme(), /must be called in a browser/);
    assert.throws(() => initToc(), /must be called in a browser/);
    for (const entry of ["styles.css", "accents.css", "styles/base.css",
      "styles/components/forms.css", "icons.svg", "icons/check.svg"]) {
      const filename = fileURLToPath(import.meta.resolve("@shanmukh98/lineframe-ui/" + entry));
      assert.ok(readFileSync(filename).length > 0, entry);
    }
  `,
    ],
    { cwd: scratch, stdio: "pipe" },
  );
  const installed = JSON.parse(
    await readFile(
      path.join(scratch, "node_modules/@shanmukh98/lineframe-ui/package.json"),
      "utf8",
    ),
  );
  assert.equal(Object.keys(installed.dependencies ?? {}).length, 0);
  console.log(
    `Package smoke passed: ${artifact.filename}, ${names.size} files, no runtime dependencies.`,
  );
} finally {
  await rm(scratch, { recursive: true, force: true });
}
