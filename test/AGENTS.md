# Testing Lineframe

- Unit tests use Node's built-in runner; browser scenarios use Playwright.
- Test rendered behavior and accessible names, not just class presence.
- Cover both themes, each palette, a 320px viewport, keyboard focus, native
  controls, reduced motion, and relevant no-JavaScript behavior.
- Treat axe as a useful automated screen, not proof of WCAG conformance.
- Check computed contrast after transitions settle; CSS transitions can be
  canceled, so do not assume every `Animation.finished` promise resolves.
- Wait for an observable navigation/layout condition instead of arbitrary
  short sleeps. Long smooth-scroll jumps need time to reach their destination.
- Include the final article section, repeated initialization/cleanup, direct
  hashes, and browser navigation when touching TOC behavior.
- Verify the packed artifact's exports and files. Source-only tests cannot
  establish that a consumer can actually install and import the release.
- Keep screenshots and browser output in ignored directories. Do not bless
  new visual baselines without looking at the actual images.
