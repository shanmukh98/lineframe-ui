const assert = require("node:assert/strict");
const test = require("node:test");
const preferenceModule = import("../dist/behaviors/theme/preference.js");

test("system theme applies only without a manual choice", async () => {
  const { resolveTheme } = await preferenceModule;
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme(null, false), "light");
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
});

test("theme validation accepts only documented values", async () => {
  const { isTheme } = await preferenceModule;
  for (const value of ["light", "dark"]) assert.equal(isTheme(value), true);
  for (const value of ["auto", "", null, undefined, true]) assert.equal(isTheme(value), false);
});

test("unsupported persisted values emit a warning and return to system mode", async (t) => {
  const { parsePreference } = await preferenceModule;
  const warning = t.mock.method(console, "warn", () => {});
  assert.equal(parsePreference("unsupported"), null);
  assert.equal(parsePreference(null), null);
  assert.equal(warning.mock.callCount(), 1);
});

test("the public module is safe to import without browser globals", async () => {
  const { initTheme, initToc } = await import("../dist/index.js");
  assert.equal(typeof globalThis.window, "undefined");
  assert.throws(() => initTheme(), /must be called in a browser/);
  assert.throws(() => initToc(), /must be called in a browser/);
});
