# Contributing to Lineframe UI

Lineframe is a generic, framework-agnostic UI library, not an application or
personal-site theme. Small, composable contributions are welcome: clearer
documentation, reproducible bug reports, native HTML examples, focused tests,
and reusable components.

Read [AGENTS.md](AGENTS.md) and any more specific `AGENTS.md` before editing.
Discuss a new public component or API in an issue before investing in a large
implementation. Keep changes focused, explain tradeoffs, and treat contributors
respectfully.

## Set up

Use Node.js **22.12 or newer**; **Node.js 24 is recommended** and used in CI.
Install from the repository root with the committed lockfile:

```sh
npm ci
npm run dev
```

The development command watches library modules, declarations, and newly added
source files, and runs the Astro 7 documentation
website in `website/`. Use the local URL printed by Astro. The static site's base
is `/lineframe-ui`; its configured public URL is
<https://shanmukh98.github.io/lineframe-ui/>. Examples and asset links must work
under that base, not just at `/`.

Do not change the lockfile merely to install dependencies. When a dependency
change is intentional, update `package.json` and `package-lock.json` together.
Build and website dependencies are separate from the runtime library, which
must stay dependency-free unless a compelling, reviewed need says otherwise.

## Source map

| Location             | What belongs here                                                    |
| -------------------- | -------------------------------------------------------------------- |
| `src/styles/tokens/` | Shared design tokens and paired accent palettes                      |
| `src/styles/`        | Foundations, layouts, utilities, and individual components           |
| `src/behaviors/`     | Optional, typed theme and TOC controllers and helpers                |
| `src/entries/`       | Browser entrypoints with automatic initialization                    |
| `src/icons/`         | Original standalone SVGs; filenames become sprite symbol IDs         |
| `scripts/`           | Deterministic builds, asset copying, and package smoke checks        |
| `test/`              | Node unit regressions and Playwright browser coverage                |
| `website/`           | Astro documentation, examples, and website-only styling              |
| `.github/`           | Issue forms, review checklist, quality, Pages, and release workflows |

**Author source, not build output.** `npm run build` uses esbuild, generates
TypeScript declarations, and produces:

- Tracked root CDN assets: `lineframe.css`, `lineframe-accents.css`,
  `lineframe.js`, `lineframe-theme.js`, `lineframe-toc.js`, their JavaScript
  source maps, and `lineframe-icons.svg`.
- Ignored `dist/`: ESM modules, types, individual styles, and icons.
- Ignored `website/public/assets/`: copied browser assets, individual icons,
  and the generated `icons.json` manifest.

Commit regenerated root assets with their source changes. Do not hand-edit
these files or commit `dist/`, `website/dist/`, or copied website assets.
CI checks tracked root asset drift; it never fixes or commits generated files.

## Design and compatibility

- Let content lead: readable measure, a clear type hierarchy, deliberate space,
  and quiet borders. Keep light mode warm and dark mode black. Use accents for
  focus, actions, orientation, and small details rather than large color washes.
- Prefer native buttons, links, labels, inputs, tables, and disclosures.
  New CSS should be opt-in, `lf-*` prefixed, low-specificity, token-based, and
  independent of website styling or a JavaScript framework.
- Preserve existing `lf-*` classes, `data-lineframe-*` hooks, icon symbol IDs,
  the `window.LineframeTheme` API, and the root CDN filenames. They are public
  compatibility contracts. Document intentional breaking changes explicitly.
- `lineframe.js` is the combined auto-initializing CDN entrypoint. The theme and
  TOC browser entries also remain available. ESM imports must stay safe without
  a DOM and must not attach listeners simply because they were imported.
- Optional controllers need explicit initialization, idempotence, and teardown.
  Test repeated initialization, listener cleanup, and supported fallback paths.
  A new feature should not make JavaScript mandatory for otherwise native UI.
- Author new icons yourself using [the icon rules](src/icons/AGENTS.md). Never
  copy an icon pack, site assets, branding, or prose. See [CREDITS.md](CREDITS.md)
  for inspiration and the distinction between MIT code and website font licenses.

### Accent changes

Edit named light/dark pairs in **`src/styles/tokens/accents.css`**, not in a
generated bundle or a page-specific override. Each palette defines
`--lf-accent-light` and `--lf-accent-dark`; the theme-aware tokens use CSS
`light-dark()`. Apply a palette with `data-lineframe-accent` on the page or a
component.

Check nested palette scopes as well as the page root. Derived text, tint,
border, and focus tokens must be computed at the selected scope rather than
inheriting another scope's already-computed tint. Check system light/dark with
JavaScript disabled as well as explicit theme choices.

## Make and validate a change

1. Add a minimal, generic example in the documentation. New components need
   their native markup, states, customization points, and limitations explained.
2. Add focused regressions for behavior changes. Include relevant keyboard,
   focus, disabled, invalid, expanded, empty, and long-content cases; test
   theme and scoped-accent combinations rather than only the default palette.
3. Run the smallest relevant checks while iterating, then the complete
   verification before requesting final review. Format source and regenerate
   tracked bundles after the final edit.
4. Inspect **actual screenshots** of affected states at desktop and mobile
   widths in **both light and dark** themes. Include evidence in the PR; a
   successful build, DOM assertion, or homepage screenshot is not a visual review.

| Command                 | Purpose                                                                   |
| ----------------------- | ------------------------------------------------------------------------- |
| `npm run dev`           | Watch library sources and serve the Astro website                         |
| `npm run format`        | Format authored files with Prettier and its Astro plugin                  |
| `npm run check:format`  | Check formatting without changing files                                   |
| `npm run check`         | Check formatting, TypeScript, and Astro                                   |
| `npm run build`         | Build library bundles, modules, declarations, and assets                  |
| `npm run build:site`    | Build the library and static Astro site                                   |
| `npm run test:unit`     | Run `node:test` regressions                                               |
| `npm run test:browser`  | Run Playwright against the built website in Chromium, Firefox, and WebKit |
| `npm run check:package` | Pack and install a real artifact to smoke-test consumer entrypoints       |
| `npm run verify`        | Run check, site build, unit, browser, and package checks                  |

Build the site before running browser tests independently. On a machine you
control, Playwright may first require:

```sh
npx playwright install --with-deps chromium firefox webkit
```

`--with-deps` can install operating-system packages. Do not run it on a shared
machine without the owner's approval. Report any checks you could not run and
why rather than claiming they passed.

### Accessibility is contextual

Review keyboard-only operation, visible focus, zoom, reduced motion, meaningful
labels, and non-color state indicators. Measure final color combinations:
normal text needs at least **4.5:1**, large text **3:1**, and essential UI and
focus indicators **3:1**. WCAG 2.2 AA's target-size minimum is **24 CSS px**, with
exceptions; prefer **44px** controls where practical. A 24px icon does not by
itself provide an adequate control target.

These review targets are not a blanket conformance claim. Consumers remain
responsible for their content, semantic markup, accessible names, error
communication, layout, targets, and contrast after customization. Document those
responsibilities and test the resulting page. Decorative icons should be hidden
from assistive technology; meaningful icons need context-appropriate names, and
icon-only controls need a name on the control.

## Release process

Releases support versioned CDN files and an **npm-compatible GitHub Release
tarball**. The package is not published to the public npm registry; do not
advertise `npm install @shanmukh98/lineframe-ui` as a registry installation.
The 0.7.0 tarball installation is:

```sh
npm install https://github.com/shanmukh98/lineframe-ui/releases/download/v0.7.0/shanmukh98-lineframe-ui-0.7.0.tgz
```

This URL becomes available only after that release workflow succeeds.

For maintainers:

1. Update the package and lockfile versions, changelog, documentation links,
   and examples together. Format source, run `npm run verify`, and inspect the
   affected desktop/mobile screenshots in both themes.
2. Commit source and regenerated tracked root bundles together. Merge to `main`
   and wait for the **Quality** job to pass for the exact release commit.
   Confirm the manual visual review separately; CI is not a substitute.
3. Only then create an annotated `vX.Y.Z` tag matching `package.json` on that
   reviewed commit and push it. Restrict release-tag creation to maintainers.
   Tags are immutable: never move, force-push, or reuse a published version.
4. The tag workflow checks the version, runs `npm ci`, builds the library,
   runs unit and real-package checks, and creates the tarball with `npm pack`.
   A separate release job attaches it to a GitHub Release using `GITHUB_TOKEN`.
   There is no npm token or npm-registry publication.
5. Confirm the release contains `shanmukh98-lineframe-ui-X.Y.Z.tgz`, test its
   download/install URL, and check the versioned CDN entrypoints. A failed run
   is not a published release. Rerun a failed workflow against the same immutable
   tag only if no release was published; never replace an existing release asset
   with different bytes. Fix published mistakes in a new version.

Pages is independent of tag publication. The quality workflow deploys
`website/dist` only after all checks on a trusted `main` push or a manual dispatch
on `main`. Pull requests never deploy. A maintainer must first configure Pages
to use **GitHub Actions** and restrict the `github-pages` environment to `main`;
the workflow deliberately does not enable Pages or change repository settings.
