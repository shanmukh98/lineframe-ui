# Icon design rules

Read the root and `src/AGENTS.md` rules first.

- Author original, minimal geometry. Do not fetch, trace, or copy an icon pack.
  These icons are original Lineframe assets covered by the root MIT license.
- Use a `0 0 24 24` viewBox and standalone `width="24"` / `height="24"`.
  Keep most geometry inside the 3–21 grid, allowing optical adjustments rather
  than forcing every shape to occupy the same area.
- Use `fill="none"`, `stroke="currentColor"`, `stroke-width="1.5"`,
  `stroke-linecap="round"`, and `stroke-linejoin="round"` on the SVG root.
  Preserve clear negative space and distinguishable silhouettes at 16px and 24px.
- Keep paths and shapes self-contained: no scripts, styles, event attributes,
  external references, embedded images, hardcoded colors, or font dependencies.
  Avoid internal IDs; the build wraps each file's inner geometry in a symbol.
- Use descriptive kebab-case filenames. The filename without `.svg` is the
  public symbol ID, so renaming an icon is an API change.
- Do not bake in `<title>`, `<desc>`, `role`, or ARIA attributes. Accessible naming
  depends on the use: hide redundant decorative SVGs from assistive technology;
  name icon-only buttons on the button; give meaningful standalone images an
  appropriate accessible name or `alt`. Do not make every use decorative.
- Check alignment, clipping, stroke weight, and meaning in actual light/dark
  screenshots. Essential icons need sufficient contrast; color alone cannot
  identify a state. A 24px drawing is not automatically a sufficient hit target.
- Edit these sources, not the generated sprite or copied assets. Run
  `npm run build` to regenerate `lineframe-icons.svg`, `dist/icons/`, and website
  assets. Keep the generated root sprite committed; leave `dist/` untracked.
