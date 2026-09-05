# Working on the documentation website

This directory is the public documentation for **Lineframe UI**, not a personal
site. Follow the root `AGENTS.md` as well as these scoped rules.

## Design and content

- Use the library itself for components. Keep documentation chrome in small
  `src/styles/` modules; do not fork or redefine shared `lf-*` components here.
- Keep the paper-light and true-black themes, quiet one-pixel frames, compact
  controls, and a restrained typographic hierarchy. Color should orient, not
  overwhelm. Aim for a reading measure of 65–75 characters.
- Use one left-hand documentation rail. On small screens, present its links in
  a native disclosure. Do not add a competing right-hand table of contents.
- Prefer semantic HTML and Markdown. Navigation, disclosures, and reading must
  work without JavaScript. Enhance only controls with a real implemented action.
- Every example needs a purpose, accessible names, and keyboard operation.
  Explain consumer responsibilities rather than promising blanket conformance.
- Use local, repository-authored examples only. `Demo.astro` may render these
  trusted snippets; never pass user, URL, or remote content to `set:html`.
- Render a live example and its escaped source from the same string when
  practical. Clearly identify documentation-only behavior.
- Credit https://cobanov.dev/ for editorial inspiration and
  https://tv.cobanov.dev/ for the initial journey. Never copy their source,
  prose, identity, or imagery, or suggest endorsement.

## Implementation

- This is an Astro static site with the repository's root dependencies, not a
  separate package. Use `src/lib/urls.ts` for internal routes and public assets.
- Keep `/lineframe-ui/` deployments, canonical URLs, social assets, and the 404
  working. Do not hard-code site-root-relative paths.
- Preserve whitespace around inline prose. HTML compression is disabled; keep
  the rendered word-spacing regression when changing that setting.
- Load the theme controller before styles. Theme state belongs on the document
  root; pages only select a named `data-lineframe-accent`.
- Treat `public/assets/` and `dist/` as generated. The root build copies shared
  assets into `public/assets/`. Edit `src/` at the repository root for library
  changes, not generated bundles or copied website assets.
- Palette values come from `src/styles/tokens/accents.css` at the repository
  root. Do not repeat their hex values throughout the documentation.
- Fonts are optional, locally served Fontsource Latin subsets. Keep their
  actual OFL licenses in `public/licenses/` and credit them in the philosophy
  page. Override font tokens on the website's `.site-body`, not in the library's
  foundation. Do not request Google Fonts or other third-party font services.
- Document version-pinned CDN and GitHub release-tarball installation. Do not
  imply the package is available from the npm registry.

## Verification

Use the root commands documented in `CONTRIBUTING.md`. For a website-only
change, `astro check --root website` and `astro build --root website` can be run
after the library assets have been generated. Check 320px and desktop layouts
in both themes, keyboard focus, native mobile navigation, copy feedback, form
examples, valid links, and a JavaScript-disabled page. Automated checks are
useful evidence, not proof of WCAG conformance.
