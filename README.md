# Lineframe UI

Lineframe UI is a small, dependency-free CSS system for personal sites,
technical blogs, and documentation. It combines warm editorial typography,
hairline frames, responsive split sections, and deliberately restrained color.

The design is original. It is inspired by broad editorial-web principles such
as visible grids, generous spacing, quiet metadata, and strong type hierarchy.

## Use

```html
<script
  src="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.5.0/lineframe-theme.js"
></script>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.5.0/lineframe.css"
>
<script
  src="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.5.0/lineframe-toc.js"
  defer
></script>
<body class="lf-site" style="--lf-accent: #526f7d">
```

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

Set `--lf-accent` on a page wrapper or `body`:

```html
<body class="lf-site" style="--lf-accent: #7a6650">
```

Accent color is intentionally limited to small markers, link decoration,
focus rings, selection, and hover borders. It does not recolor entire panels.

In Jekyll, expose it through front matter:

```yaml
---
accent: "#6c728f"
---
```

```html
<body
  class="lf-site"
  data-theme="{{ site.theme_mode | default: 'light' }}"
  style="--lf-accent: {{ page.accent | default: site.accent }}"
>
```

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
