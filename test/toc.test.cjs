const assert = require("node:assert/strict");
const test = require("node:test");

const activeModule = import("../dist/behaviors/toc/active-section.js");
const headingsModule = import("../dist/behaviors/toc/headings.js");

async function active(scrollY, positions = [300, 1200, 1800], height = 2500, viewport = 1000) {
  const { activeSectionIndex } = await activeModule;
  return activeSectionIndex(
    positions.map((top) => top - scrollY),
    124,
    scrollY,
    viewport,
    height,
  );
}

test("tracks headings below the sticky header", async () => {
  assert.equal(await active(0), 0);
  assert.equal(await active(1100), 1);
});

test("activates a short final section at the bottom", async () => {
  assert.equal(await active(1500), 2);
  assert.equal(await active(1499.5), 2);
});

test("does not activate the last section merely because it is visible", async () => {
  assert.equal(await active(1495), 1);
});

test("resumes normal heading tracking when scrolling back up", async () => {
  assert.equal(await active(1500), 2);
  assert.equal(await active(1100), 1);
});

test("does not jump to the last heading on an unscrolled short page", async () => {
  assert.equal(await active(0, [300, 500, 700], 1000), 0);
});

test("an empty heading list has no active item", async () => {
  assert.equal(await active(0, []), -1);
});

test("slugs retain international letters and normalize accents", async () => {
  const { slugify } = await headingsModule;
  assert.equal(slugify("  Reading & writing  "), "reading-writing");
  assert.equal(slugify("D\u00e9j\u00e0 vu"), "deja-vu");
  assert.equal(slugify("\u65e5\u672c\u8a9e"), "\u65e5\u672c\u8a9e");
});

test("malformed fragments are reported rather than crashing navigation", async (t) => {
  const { decodeFragment } = await headingsModule;
  const warning = t.mock.method(console, "warn", () => {});
  assert.equal(decodeFragment("#hello%20world"), "hello world");
  assert.equal(decodeFragment("#%E0%A4%A"), null);
  assert.equal(warning.mock.callCount(), 1);
});
