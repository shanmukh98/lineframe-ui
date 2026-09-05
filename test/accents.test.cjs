const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const css = readFileSync(path.join(__dirname, "../src/styles/tokens/theme.css"), "utf8");
const accents = readFileSync(path.join(__dirname, "../src/styles/tokens/accents.css"), "utf8");

function token(name, mode = 0) {
  const values = css.match(
    new RegExp(`${name}:\\s*light-dark\\((#[a-f\\d]{6}),\\s*(#[a-f\\d]{6})\\)`, "i"),
  );
  assert.ok(values?.[mode + 1], `Missing ${name} for mode ${mode}`);
  return values[mode + 1];
}

function luminance(hex) {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)
    .map((value) => parseInt(value, 16) / 255)
    .map((value) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function assertContrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)];
  const ratio = (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
  assert.ok(ratio >= 4.5, `${foreground} on ${background}: ${ratio.toFixed(2)}:1`);
}

const palettes = [
  ...accents.matchAll(
    /\[data-lineframe-accent="([^"]+)"\]\s*\{\s*--lf-accent-light:\s*(#[a-f\d]{6});\s*--lf-accent-dark:\s*(#[a-f\d]{6});\s*\}/gi,
  ),
];

test("each named palette has a light and dark value", () => {
  const names = [...accents.matchAll(/\[data-lineframe-accent="([^"]+)"\]/g)].map(
    (match) => match[1],
  );
  assert.ok(names.length > 0);
  assert.deepEqual(
    palettes.map((match) => match[1]),
    names,
  );
});

for (const [, name, light, dark] of palettes) {
  test(`${name} keeps small accent text and button labels readable in both modes`, () => {
    for (const background of ["--lf-bg", "--lf-code", "--lf-panel", "--lf-panel-raised"]) {
      assertContrast(light, token(background));
      assertContrast(dark, token(background, 1));
    }
    assertContrast("#000000", dark);
  });
}

test("metadata and code comments retain readable contrast in both modes", () => {
  for (const mode of [0, 1]) {
    for (const background of ["--lf-bg", "--lf-code", "--lf-panel", "--lf-panel-raised"]) {
      assertContrast(token("--lf-faint", mode), token(background, mode));
    }
  }
});

test("semantic colors and essential control boundaries retain contrast", () => {
  for (const mode of [0, 1]) {
    for (const status of ["--lf-info", "--lf-success", "--lf-warning", "--lf-danger"]) {
      assertContrast(token(status, mode), token("--lf-panel", mode));
    }
    const border = luminance(token("--lf-control-border", mode));
    const background = luminance(token("--lf-panel", mode));
    const ratio = (Math.max(border, background) + 0.05) / (Math.min(border, background) + 0.05);
    assert.ok(ratio >= 3, `Essential control boundary contrast: ${ratio.toFixed(2)}:1`);
  }
});
