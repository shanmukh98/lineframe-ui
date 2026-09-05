const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = readFileSync(path.join(__dirname, "../lineframe-toc.js"), "utf8");

function createPage({ height = 2500, viewport = 1000, positions = [300, 1200, 1800] } = {}) {
  const listeners = new Map();
  const window = {
    scrollY: 0,
    innerHeight: viewport,
    location: { hash: "" },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    requestAnimationFrame: (callback) => callback(),
    addEventListener: (type, callback) => listeners.set(type, callback)
  };
  const createElement = () => ({
    dataset: {},
    children: [],
    attributes: {},
    append(child) { this.children.push(child); },
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    addEventListener() {}
  });
  const headings = positions.map((top, index) => ({
    id: `section-${index + 1}`,
    tagName: "H2",
    textContent: `Section ${index + 1}`,
    getBoundingClientRect: () => ({ top: top - window.scrollY })
  }));
  const list = createElement();
  const prose = { querySelectorAll: () => headings };
  const article = { querySelector: () => prose };
  const toc = {
    dataset: {},
    hidden: true,
    closest: () => article,
    querySelector: (selector) => selector === "[data-lineframe-toc-list]" ? list : null
  };
  const document = {
    readyState: "complete",
    documentElement: { scrollHeight: height },
    createElement,
    getElementById: (id) => headings.find((heading) => heading.id === id),
    querySelector: () => ({ getBoundingClientRect: () => ({ height: 68 }) }),
    querySelectorAll: () => [toc]
  };

  vm.runInNewContext(source, { window, document });

  return {
    scrollTo(y) {
      window.scrollY = y;
      listeners.get("scroll")();
    },
    activeSection() {
      return list.children
        .flatMap((item) => item.children)
        .find((link) => link.attributes["aria-current"] === "location")?.textContent;
    }
  };
}

test("tracks headings below the sticky header", () => {
  const page = createPage();
  assert.equal(page.activeSection(), "Section 1");
  page.scrollTo(1100);
  assert.equal(page.activeSection(), "Section 2");
});

test("activates the last section at the bottom even when its heading is lower", () => {
  const page = createPage();
  page.scrollTo(1500);
  assert.equal(page.activeSection(), "Section 3");
});

test("allows fractional scroll positions at the bottom", () => {
  const page = createPage();
  page.scrollTo(1499.5);
  assert.equal(page.activeSection(), "Section 3");
});

test("does not activate the final section just because it is visible", () => {
  const page = createPage();
  page.scrollTo(1495);
  assert.equal(page.activeSection(), "Section 2");
});

test("resumes normal heading tracking when scrolling back up", () => {
  const page = createPage();
  page.scrollTo(1500);
  assert.equal(page.activeSection(), "Section 3");
  page.scrollTo(1100);
  assert.equal(page.activeSection(), "Section 2");
});

test("does not jump to the last heading on an unscrolled short page", () => {
  const page = createPage({ height: 1000, positions: [300, 500, 700] });
  assert.equal(page.activeSection(), "Section 1");
});
