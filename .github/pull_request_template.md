## Summary

What problem does this solve? Link an issue if one exists, and note public API or
compatibility changes.

## Validation and evidence

List the checks you ran and their results. Explain skipped checks. For visual
changes, attach actual desktop/mobile screenshots in both light and dark themes
and describe the affected states, keyboard checks, and contrast measurements.

## Checklist

Mark non-applicable items explicitly in the description.

- [ ] The change is generic, composable, native-first, and free of casual runtime dependencies.
- [ ] Existing classes, data hooks, icon IDs, browser APIs, and CDN filenames are preserved, or a breaking change is documented.
- [ ] Source was edited, tracked bundles were regenerated with `npm run build`, and generated `dist/` or website output is not included.
- [ ] Relevant documentation, examples, regressions, and changelog entries are updated.
- [ ] `npm run verify` passed, or incomplete checks and their reasons are listed above.
- [ ] I inspected affected desktop/mobile screenshots in both themes, not just a homepage or DOM assertion.
- [ ] I checked keyboard/focus behavior, names, non-color states, contrast, and target sizes where relevant.
- [ ] Any new assets are original or have reviewed licenses and accurate attribution.
