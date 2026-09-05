# Lineframe UI

Lineframe UI is a small, dependency-free CSS system for personal sites,
technical blogs, and documentation. It combines warm editorial typography,
hairline frames, responsive split sections, and deliberately restrained color.

The design is original. It is inspired by broad editorial-web principles such
as visible grids, generous spacing, quiet metadata, and strong type hierarchy.

## Use

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<script
  src="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.6.0/lineframe-theme.js"
></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.6.0/lineframe.css"
>
<script
  src="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.6.0/lineframe-toc.js"
  defer
></script>
<body class="lf-site" data-lineframe-accent="slate">
```

Do not cap the viewport's scale or disable user zoom. When self-hosting, keep
`lineframe.css` and `lineframe-accents.css` together; the main stylesheet imports
the palette module.

The theme script uses the browser's `prefers-color-scheme` value by default.
Add a manual toggle anywhere in the page:

```html
<button class="lf-theme-toggle" data-lineframe-theme-toggle type="button">
  <span class="lf-theme-toggle__mark" aria-hidden="true"></span>
  <span class="lf-theme-toggle__label" data-lineframe-theme-label>Dark</span>
</button>
```

Manual choices are stored under `lineframe-theme`. Call
`window.LineframeTheme.reset()` to return to the browser preference.

## Per-page accents

All named palettes live in **`lineframe-accents.css`**. Each defines
`--lf-accent-light` and `--lf-accent-dark`; the theme selects the right value.
The included presets are `slate` (default), `violet`, `moss`, and `clay`.

```html
<body class="lf-site" data-lineframe-accent="violet">
```

To change a palette, edit its two colors in that module. To add one, add a
selector with the same paired tokens:

```css
[data-lineframe-accent="ocean"] {
  --lf-accent-light: #4f6b7a;
  --lf-accent-dark: #86a1ad;
}
```

Use `data-lineframe-accent="ocean"` on the body or a scoped component. The
library recomputes text, fills, borders, selection, and focus colors at that
scope, so tints do not accidentally inherit another page's palette. Keep
accent text at least 4.5:1 against the backgrounds used in each theme.

Existing direct `--lf-accent` overrides still work, but they use one color in
both modes. Prefer named, paired palettes for new pages.

In Jekyll, pages select a palette by name rather than repeating hex values:

```yaml
---
accent: violet
---
```

```html
<body
  class="lf-site"
  data-lineframe-accent="{{ page.accent | default: site.accent | default: 'slate' | escape }}"
>
```

Set `accent: slate` in `_config.yml` for the site default. Keep theme selection
on the root element under the theme controller, not in each page's front matter.

## Components

- `lf-shell`, `lf-frame`: centered framed page structure
- `lf-header`, `lf-nav`: responsive navigation
- `lf-theme-toggle`: system-aware light/dark control
- `lf-hero`: editorial introduction
- `lf-section`: label/content split section
- `lf-post-list`: writing or project index
- `lf-article`: readable long-form layout
- `lf-toc`: generated sticky article navigation
- `lf-prose`: Markdown typography
- `lf-button`, `lf-tag`, `lf-meta`: small interface elements

Open `demo/index.html` to preview both themes and several accent colors.

## Article table of contents

Add an initially hidden TOC before the prose. The script fills it from `h2`
and `h3` elements, makes links clickable, and updates the active section while
the reader scrolls.

```html
<div class="lf-article__layout" data-lineframe-article>
  <header class="lf-article__header"><!-- Title and metadata --></header>
  <aside class="lf-article__rail">
    <nav class="lf-toc" data-lineframe-toc aria-label="On this page" hidden>
      <p class="lf-toc__title">On this page</p>
      <button class="lf-toc__toggle" type="button" aria-expanded="false">
        <span>On this page</span>
        <span class="lf-toc__toggle-mark" aria-hidden="true">+</span>
      </button>
      <ol class="lf-toc__list" data-lineframe-toc-list></ol>
    </nav>
  </aside>
  <div class="lf-article__body">
    <div class="lf-prose" data-lineframe-prose>
      <!-- Article headings and content -->
    </div>
  </div>
</div>
```

On wide screens the TOC stays on the left as the page scrolls. At narrower
widths it becomes a collapsible block above the article.

## Development

Run `npm test` with Node.js 18 or newer for the dependency-free regression
tests. Preview `demo/index.html` in both themes when changing shared styles.
