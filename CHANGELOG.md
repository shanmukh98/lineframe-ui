# Changelog

## 0.7.0

- Split authoritative library source into modular CSS tokens, foundations,
  layouts, components, optional TypeScript behaviors, and browser entrypoints.
- Add typed, explicit theme and TOC APIs with teardown and server-safe imports,
  while retaining the browser auto-initializers and existing public hooks.
- Use theme-aware `light-dark()` tokens for system colors without JavaScript,
  with scoped light/dark accent pairs and optional persisted manual themes.
- Add forms, alerts, badges, tables, native disclosure, pagination, and
  composable layout helpers.
- Add twelve original, MIT-licensed SVG icons as standalone assets and a sprite.
- Add Astro documentation and design philosophy, contributor guidance,
  inspiration credits, issue forms, and quality, Pages, and tarball-release
  workflows.
- Add module/type outputs, individual style/icon exports, browser coverage, and
  real-package smoke checks without adding runtime dependencies.

**Source migration from 0.6.0:** root `lineframe*.css`, `lineframe*.js`, their
source maps, and `lineframe-icons.svg` are generated compatibility assets.
Edit `src/`, run `npm run build`, and commit the regenerated root files.
Do not author bundles or commit `dist/`. Existing CDN filenames remain available;
package installation uses GitHub Release tarballs, not the public npm registry.

## 0.6.0

- Centralized named light/dark accent pairs and scoped accent tints.
- Improved text contrast and corrected final-section article TOC navigation.
- Reduced oversized article introductions while preserving the editorial layout.
