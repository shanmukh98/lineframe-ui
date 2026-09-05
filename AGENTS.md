# Working on Lineframe UI

Lineframe is a framework-agnostic, content-first UI library, not a personal
blog theme. Keep browser assets free of runtime dependencies. Build tooling
and the documentation website may have development dependencies.

## Design principles

- Let content lead. Use a clear type hierarchy, comfortable reading widths,
  deliberate whitespace, and quiet structural borders.
- Keep light mode warm and dark mode genuinely black. Reserve accent color
  for orientation, actions, focus, and small details, not large page washes.
- Define paired light/dark palettes in `src/styles/tokens/accents.css`.
  Derive tint tokens at the scope where the palette is selected.
- Prefer native HTML. Never replace a button, link, label, input, or disclosure
  with a generic element just to make styling easier.
- Preserve keyboard operation, visible focus, zoom, and reduced motion.
  Target WCAG 2.2 AA: normal text at least 4.5:1, large text 3:1, and essential
  control/focus indicators 3:1. Aim for 44px control targets; never present
  44px as the WCAG AA minimum of 24px (which also has exceptions).
- Do not communicate state through color alone. Include text, shape, native
  state, or another non-color signal.
- Favor a small set of composable components over application-specific
  widgets. Examples must be generic and usable outside this repository.
- Credit the editorial inspiration at https://cobanov.dev/ and the original
  journey at https://tv.cobanov.dev/. Do not copy their source, branding,
  writing, or imagery, or imply an affiliation or endorsement.

## Source ownership

- `src/styles/`: tokens, foundations, layouts, and individual CSS components.
- `src/behaviors/`: optional TypeScript controllers and their focused helpers.
- `src/icons/`: original, consistent SVG assets.
- `src/entries/`: browser auto-initialization entry points.
- `scripts/`: deterministic builds, packaging, and asset generation.
- `website/`: documentation and examples; website-only styles stay here.
- `test/`: unit and browser regressions.

The root `lineframe*.css`, `lineframe*.js`, and `lineframe-icons.svg` files are
generated compatibility assets for existing CDN users. **Edit source, then
run `npm run build`; do not hand-edit the bundles.** Keep these root files
committed. `dist/` and the generated website output are not committed.

## Engineering rules

- Preserve existing `lf-*` classes, `data-lineframe-*` hooks, root CDN filenames,
  and the `window.LineframeTheme` API unless documenting a breaking release.
- New CSS is opt-in and prefixed. Use low-specificity foundations, design
  tokens, logical properties, and component-local responsive rules.
- Export typed, explicit JavaScript initialization and cleanup. Importing the
  module must not require a browser or attach listeners as a side effect.
- Avoid duplicate initialization, leaked listeners, broad catches, unsafe
  HTML insertion, and undocumented fallback behavior.
- Ship documentation and examples with changes to a public interface.
- Do not claim npm-registry publication, full accessibility conformance,
  browser coverage, or a successful deployment without evidence.

## Commands and completion

Use Node.js 22.12 or newer and `npm ci`.

- `npm run dev`: rebuild the library while serving the docs locally.
- `npm run build`: generate browser bundles, module outputs, icons, and types.
- `npm run check`: check library types and Astro documentation.
- `npm run build:site`: build the documentation website.
- `npm run test:unit`: run dependency-free unit regressions.
- `npm run test:browser`: run Playwright scenarios against the built website.
- `npm run check:package`: inspect a real npm-compatible package artifact.
- `npm run verify`: run the complete release checks.

For visual changes, inspect actual desktop and mobile screenshots in both
themes before committing. Check the affected component states, not just the
homepage. Regenerate tracked bundles and keep unrelated changes out of commits.
