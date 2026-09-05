# Library source rules

Read the repository's `AGENTS.md` before changing source.

## Styles

- Keep a component's base, state, responsive, and reduced-motion rules together.
  Do not rebuild a global file of unrelated media-query overrides.
- Use `lineframe.tokens`, `lineframe.base`, `lineframe.layout`,
  `lineframe.components`, and `lineframe.utilities` cascade layers in that
  order. Foundations should not win against component styles through specificity.
- Use `lf-*` classes and existing `--lf-*` tokens. Expose a small, documented
  set of customization properties rather than an option for every declaration.
- The authoritative accent palette is `styles/tokens/accents.css`. Each named
  preset needs light and dark values with readable contrast. Recompute derived
  tokens at palette scopes; inherited computed tints can otherwise be stale.
- Color is an enhancement, not the only state indicator. Native invalid,
  selected, disabled, checked, and expanded states need appropriate examples.
- Do not make a generic component depend on website-only CSS or a framework.

## Behaviors

- Importing the ESM entry must be safe in server-rendered applications.
- Initializers must be idempotent and expose cleanup. Remove listeners,
  pending animation frames, and generated DOM on teardown.
- Use `textContent` for generated labels and native navigation when possible.
  Preserve user-supplied IDs and handle duplicate headings.
- Respect reduced motion and system theme changes. Keep manual theme choices
  separate from system defaults and provide a way to reset.
- Catch only expected platform failures, with an explicit warning; propagate
  unexpected errors. A denied storage API must not strand the theme control.

Add a focused regression and a real documentation example for new behavior.
Build outputs belong to the build scripts, not manual edits.
