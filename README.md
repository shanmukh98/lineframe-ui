# Lineframe UI

Lineframe UI is a small, dependency-free CSS system for personal sites,
technical blogs, and documentation. It combines warm editorial typography,
hairline frames, responsive split sections, and deliberately restrained color.

The design is original. It is inspired by broad editorial-web principles such
as visible grids, generous spacing, quiet metadata, and strong type hierarchy.

## Use

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v0.1.0/lineframe.css"
>
<body class="lf-site" data-theme="light" style="--lf-accent: #526f7d">
```

The default theme is light. Dark mode is available with:

```html
<body class="lf-site" data-theme="dark">
```

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
- `lf-hero`: editorial introduction
- `lf-section`: label/content split section
- `lf-post-list`: writing or project index
- `lf-article`: readable long-form layout
- `lf-prose`: Markdown typography
- `lf-button`, `lf-tag`, `lf-meta`: small interface elements

Open `demo/index.html` to preview both themes and several accent colors.
