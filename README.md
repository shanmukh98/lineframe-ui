# Lineframe UI

A framework-agnostic UI library for content-first websites. Quiet structure,
readable typography, native controls, and accents that adapt to light and dark.
No runtime dependencies. MIT licensed.

**[Documentation and live examples](https://shanmukh98.github.io/lineframe-ui/)** |
[Design philosophy](https://shanmukh98.github.io/lineframe-ui/docs/philosophy/) |
[Contributing](CONTRIBUTING.md)

## Start with HTML

Add the version-pinned browser assets to the document head. The optional script
initializes theme controls and article navigation; native components and automatic
system colors work without JavaScript.

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
<script src="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.7.0/lineframe.js"></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.7.0/lineframe.css"
/>
```

Opt the page into the foundation styles and select an accent:

```html
<body class="lf-site" data-lineframe-accent="slate">
  <main class="lf-container">
    <h1>Make room for the content.</h1>
    <button class="lf-button" type="button" data-lineframe-theme-toggle>
      <span data-lineframe-theme-label>Dark</span>
    </button>
  </main>
</body>
```

Keep zoom enabled. Load the script before styles when using persisted themes to
avoid a wrong-theme flash. Self-hosting the browser assets is also supported.
The combined stylesheet includes its palette definitions.

## Use with a bundler

Install the versioned **npm-compatible GitHub Release tarball**:

```sh
npm install https://github.com/shanmukh98/lineframe-ui/releases/download/v0.7.0/shanmukh98-lineframe-ui-0.7.0.tgz
```

The package is **not published to the public npm registry**. This URL is a
release artifact, not a registry shortcut.

```js
import "@shanmukh98/lineframe-ui/styles.css";
import { initTheme, initToc } from "@shanmukh98/lineframe-ui";

// Call after mounting your client-side interface.
const theme = initTheme();
const destroyToc = initToc();
```

Call `destroyToc()` and `theme.destroy()` when unmounting. Initialization is
idempotent. Importing the module is safe during server rendering; initializing
it requires a browser.

For smaller CSS compositions, import the foundation **first**, followed by the
components you use:

```js
import "@shanmukh98/lineframe-ui/styles/base.css";
import "@shanmukh98/lineframe-ui/styles/components/buttons.css";
import "@shanmukh98/lineframe-ui/styles/components/forms.css";
```

## A small, composable system

| Area        | Included                                                                                 |
| ----------- | ---------------------------------------------------------------------------------------- |
| Foundations | Typography, spacing, surfaces, paired accent palettes, focus and reduced-motion defaults |
| Layout      | Containers, stacks, clusters, grids, frames, cards, editorial sections                   |
| Controls    | Buttons, labeled native fields, selects, checkboxes, radios, textareas                   |
| Content     | Prose, tables, native disclosures, alerts, badges, writing lists                         |
| Navigation  | Headers, back links, pagination, collapsible article TOCs, skip links                    |
| Assets      | Twelve original SVG icons, individual files, a sprite, and source maps                   |
| Behaviors   | Optional typed theme and TOC controllers with explicit teardown                          |

Native semantics come first. A class cannot supply a missing label, disable an
anchor, or make arbitrary markup accessible. Examples document keyboard behavior,
required markup, and consumer responsibilities rather than promising blanket
WCAG conformance.

Lineframe targets modern browsers with Baseline 2024 CSS features, including
`light-dark()`, `color-mix()`, and cascade layers. Font names are optional tokens;
the runtime library never requests remote fonts, analytics, or third-party scripts.

## Themes and page accents

Select `slate`, `violet`, `moss`, or `clay` on a page or component:

```html
<section data-lineframe-accent="violet">
  <span class="lf-tag">A different accent, the same system</span>
</section>
```

The single authoritative palette module is
[`src/styles/tokens/accents.css`](src/styles/tokens/accents.css). Every preset
defines `--lf-accent-light` and `--lf-accent-dark`; derived fills, borders, and
focus colors are calculated at the selected scope. Edit that module and rebuild,
or add a paired preset in your application's stylesheet.

Themes follow the system by default. Manual choices persist until reset:

```js
theme.set("dark");
theme.reset(); // Follow the system again.
```

The CDN API remains available as `window.LineframeTheme`. Existing
`lineframe-theme.js` and `lineframe-toc.js` entrypoints are still supported; use
either those separate scripts or the combined `lineframe.js`.

## Develop and contribute

Use Node.js 22.12 or newer (24 recommended):

```sh
npm ci
npm run dev
```

Author `src/`, not the generated root bundles. The website lives in `website/`;
build, package, and test tooling are separate from the runtime library.
`AGENTS.md` files capture the design and engineering constraints for contributors
and coding assistants.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the source map, focused commands,
browser setup, visual review, and release process. Run `npm run verify` before
requesting final review, and include evidence for the components you changed.

## Inspiration and license

[cobanov.dev](https://cobanov.dev/) inspired the editorial restraint;
[tv.cobanov.dev](https://tv.cobanov.dev/) started the journey. Lineframe's code,
components, and icons are original. No source, artwork, branding, or endorsement
from those sites is implied.

See [CREDITS.md](CREDITS.md), [CHANGELOG.md](CHANGELOG.md), and the [MIT license](LICENSE).
