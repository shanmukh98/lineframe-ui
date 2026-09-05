## Start with the contribution guide

The root
[CONTRIBUTING.md](https://github.com/shanmukh98/lineframe-ui/blob/main/CONTRIBUTING.md)
is the source of truth for repository setup, reviews, and pull requests. The
root [AGENTS.md](https://github.com/shanmukh98/lineframe-ui/blob/main/AGENTS.md)
records the project’s design and engineering rules; scoped instructions apply
where present.

Useful contributions include a reproducible bug, a clearer example, a keyboard
fix, better documentation, or a broadly reusable component with a demonstrated
need. For a substantial addition or a public API change, open an issue to agree
on scope before building it.

## Develop from source

Use Node.js 22.12 or newer and the root package manifest. Node.js 24 is a suitable
development baseline. The documentation site does not have a separate package.

<pre tabindex="0" aria-label="Local setup commands"><code>git clone https://github.com/shanmukh98/lineframe-ui.git
cd lineframe-ui
npm ci
npm run dev
</code></pre>

The development command rebuilds the library and serves the documentation at
`http://localhost:4321/lineframe-ui/`. Preserve that base path when checking local
links and public assets.

## Where changes belong

- `src/styles/tokens/`: paired palettes, theme values, spacing, and typography
  tokens. Define palette values here once.
- `src/styles/`: foundations, layout primitives, and individual CSS components.
- `src/behaviors/`: typed theme and TOC controllers with explicit cleanup.
- `src/entries/`: browser auto-initialization entry points.
- `src/icons/`: the original 24×24 SVG assets.
- `scripts/`: deterministic build, asset-copying, and packaging tasks.
- `website/`: documentation, local examples, and website-only presentation.
- `test/`: unit regressions and browser scenarios.

**Do not hand-edit generated bundles.** The root `lineframe*.css`,
`lineframe*.js`, and `lineframe-icons.svg` files are generated compatibility
assets. Change the source and run `npm run build`; include updated tracked CDN
bundles with the source change. `dist/`, `website/dist/`, and copied
`website/public/assets/` files are generated output, not source.

## Keep the public contract coherent

Preserve existing `lf-*` class names, `data-lineframe-*` hooks, browser filenames,
and the `window.LineframeTheme` interface unless a breaking release explicitly
documents otherwise.

For a component change, include its relevant states, a real example, and
accessible semantics. For a behavior change, cover initialization, repeated
initialization, cleanup, and keyboard operation. Do not introduce import-time
browser side effects into the module API.

For a new palette, add a paired light/dark definition in the central source
module. Check text, controls, and focus against the actual surfaces in both
themes. A palette name is preferable to repeating hex values across pages.

## Run checks that match the change

Start with the smallest existing test that covers the behavior, then run the
release checks before considering a release ready.

<pre tabindex="0" aria-label="Verification commands"><code>npm run check
npm run build:site
npm run test:unit
npm run test:browser
npm run check:package
</code></pre>

`npm run verify` runs the complete verification sequence. `npm run build`
regenerates library bundles and module output; `npm run build:site` also builds
the static documentation.

For visual changes, inspect actual desktop and mobile screenshots in both
themes. Test at 320px, check keyboard focus and reduced-motion preferences, and
exercise the changed component states. A successful build or an automated
accessibility scan is not a substitute for these checks.

## Make the review easy

Explain the problem, the chosen approach, and how you verified it. Keep the
change focused. Update the documentation when a public interface or expected
behavior changes, and include a regression test for a fixed bug when practical.

Do not copy another project’s design, prose, code, or imagery without an
appropriate license and permission. Preserve the explicit inspiration credits,
and do not imply that another creator endorses Lineframe.
