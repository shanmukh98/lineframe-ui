const assert = require("node:assert/strict");
const test = require("node:test");
const { spawn, execFile } = require("node:child_process");
const { once } = require("node:events");
const { cp, copyFile, mkdir, mkdtemp, readFile, rm, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { setTimeout: delay } = require("node:timers/promises");
const { pathToFileURL } = require("node:url");
const { promisify } = require("node:util");

async function eventually(check) {
  const deadline = Date.now() + 10000;
  while (true) {
    try {
      await check();
      return;
    } catch (error) {
      if (!(error instanceof assert.AssertionError) && error?.code !== "ENOENT") throw error;
      if (Date.now() >= deadline) throw error;
    }
    await delay(50);
  }
}

test(
  "watch mode emits added modules, types, and styles and removes retired outputs",
  { timeout: 30000 },
  async (t) => {
    const root = path.resolve(__dirname, "..");
    const scratchRoot = path.join(root, "test-results");
    await mkdir(scratchRoot, { recursive: true });
    const scratch = await mkdtemp(path.join(scratchRoot, "watch-"));
    const children = [];
    let log = "";
    t.after(async () => {
      for (const { child } of children) {
        if (child.exitCode === null && child.signalCode === null) child.kill("SIGTERM");
      }
      for (const { exited } of children) await exited;
      await rm(scratch, { recursive: true, force: true });
    });
    for (const directory of ["src", "scripts"]) {
      await cp(path.join(root, directory), path.join(scratch, directory), { recursive: true });
    }
    for (const file of ["package.json", "favicon.svg", "tsconfig.json", "tsconfig.build.json"]) {
      await copyFile(path.join(root, file), path.join(scratch, file));
    }
    for (const args of [
      ["scripts/build.mjs", "--watch"],
      [
        require.resolve("typescript/bin/tsc"),
        "-p",
        "tsconfig.build.json",
        "--watch",
        "--preserveWatchOutput",
      ],
    ]) {
      const child = spawn(process.execPath, args, {
        cwd: scratch,
        stdio: ["ignore", "pipe", "pipe"],
      });
      children.push({ child, exited: once(child, "exit") });
      child.stdout.on("data", (chunk) => {
        log += chunk;
      });
      child.stderr.on("data", (chunk) => {
        log += chunk;
      });
    }
    await eventually(() => assert.match(log, /Watching library sources/));
    await eventually(async () =>
      assert.match(await readFile(path.join(scratch, "dist/index.d.ts"), "utf8"), /initTheme/),
    );

    const index = path.join(scratch, "src/index.ts");
    const original = await readFile(index, "utf8");
    const helper = path.join(scratch, "src/watch-added.ts");
    const style = path.join(scratch, "src/styles/components/watch-added.css");
    await writeFile(helper, 'export const watchValue = "ready";\n');
    await writeFile(style, ".lf-watch-added { color: red; }\n");
    const moduleOutput = path.join(scratch, "dist/watch-added.js");
    const styleOutput = path.join(scratch, "dist/styles/components/watch-added.css");
    await eventually(async () => assert.match(await readFile(moduleOutput, "utf8"), /watchValue/));
    await eventually(async () =>
      assert.match(await readFile(styleOutput, "utf8"), /lf-watch-added/),
    );
    await eventually(async () =>
      assert.match(
        await readFile(path.join(scratch, "dist/watch-added.d.ts"), "utf8"),
        /watchValue/,
      ),
    );
    await writeFile(index, `${original}\nexport { watchValue } from "./watch-added.js";\n`);
    await eventually(async () =>
      assert.match(await readFile(path.join(scratch, "dist/index.js"), "utf8"), /watch-added/),
    );
    await promisify(execFile)(process.execPath, [
      "--input-type=module",
      "-e",
      'import assert from "node:assert/strict"; const module = await import(process.argv[1]); assert.equal(module.watchValue, "ready");',
      pathToFileURL(path.join(scratch, "dist/index.js")).href,
    ]);
    await writeFile(index, original);
    await eventually(async () =>
      assert.doesNotMatch(
        await readFile(path.join(scratch, "dist/index.js"), "utf8"),
        /watch-added/,
      ),
    );
    await rm(helper);
    await rm(style);
    await eventually(async () => assert.rejects(readFile(moduleOutput), { code: "ENOENT" }));
    await eventually(async () => assert.rejects(readFile(styleOutput), { code: "ENOENT" }));
  },
);
