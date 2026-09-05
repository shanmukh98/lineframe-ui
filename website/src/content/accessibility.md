## A foundation, not a certificate

Lineframe aims to support accessible interfaces with semantic examples, visible
focus, readable defaults, and native controls. A library cannot guarantee the
accessibility of the application built with it. Content, customization, behavior,
and the final page structure all matter.

Automated checks—including axe—catch a useful subset of issues. A passing scan
does **not** prove full WCAG conformance. Pair automation with keyboard testing,
screen-reader checks, zoom and reflow checks, and review by people who use the
interface.

## Contrast: check the actual context

- **Normal text:** at least **4.5:1** against its background.
- **Large text:** at least **3:1**. WCAG defines large text as at least 18pt, or
  14pt when bold—approximately 24px or 18.7px respectively.
- **Essential UI indicators and graphics:** at least **3:1** against adjacent
  colors when needed to identify a control, its state, or meaningful content.

A faint decorative divider and an essential input boundary do not serve the
same purpose. Check the boundary needed to recognize a control, not just the
text inside it. Do not use color as the only cue for success, errors, selection,
or the current location.

Every custom palette needs checks in **both themes**, across the surfaces and
states where it appears. A token that passes on the page canvas may fail on a
tinted panel or filled button. Check hover, active, invalid, and focus states,
not only the default view.

Primary references:
[Contrast (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
and [Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## Keep the keyboard path intact

1. Tab through the page in its logical reading order.
2. Confirm that every interactive element has a visible focus indicator.
3. Activate links with Enter and native buttons with Enter or Space.
4. Check native radio groups with arrow keys and disclosures with the keyboard.
5. Confirm that focus is not trapped and that there is a clear route back.
6. Use the skip link to bypass repeated navigation.

Do not remove outlines without a visible replacement. Avoid positive `tabindex`
values; repair source order instead. For interactions that change context, decide
where focus should go and preserve it deliberately.

Sticky headers and overlays must not entirely hide a focused control under
[Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html).
Lineframe’s design preference is stronger: keep the whole focus indicator and
target visible whenever possible. Check anchored headings and controls near a
scrolling container’s edges.

## Targets: the minimum is not the goal

WCAG 2.2 AA’s
[Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
uses **24 × 24 CSS pixels**, with defined exceptions, including qualifying
spacing and inline targets. It does not require every target to be 44px.

Lineframe prefers **44 × 44 CSS pixels** for comfortable controls where practical.
That is a design preference, not a claim about the AA minimum. Include the
interactive padding, not just the visible icon, when measuring a target. Check
adjacent small links and dense controls at actual device sizes.

## Names, roles, and useful messages

Use native HTML before ARIA. A `button` already has keyboard activation and button
semantics. A `label` connected to a field provides a name and a larger click area.
A `details` element supplies disclosure behavior without a custom widget.

- Give every field a visible label and explain required or unusual formats.
- Associate instructions and error messages with the relevant field.
- Make icon-only controls descriptive with an accessible name.
- Hide purely decorative icons from assistive technology.
- Use `aria-current="page"` for the current page and `"location"` for a current
  section within a page.
- Use a polite status region for a nonurgent result that appears after an action.
  Reserve assertive alerts for genuinely urgent dynamic messages.
- Keep table captions and header relationships meaningful.

Do not add ARIA merely to make markup look more accessible. When a native element
cannot do the job, consult the
[WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/) and implement
the whole interaction pattern, including its keyboard behavior.

## Reflow, zoom, and reduced motion

Test narrow screens and increased zoom without disabling the user’s ability to
scale the page. At a 320px CSS viewport, ordinary content should not require
horizontal page scrolling. A genuinely two-dimensional table may use its own
named, keyboard-accessible scroll container.

Let text wrap and inputs shrink. Avoid fixed heights that clip enlarged text or
longer translations. Check 200% text resizing and the reflow equivalent of 400%
zoom on a 1280px-wide viewport.

Respect
[`prefers-reduced-motion`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
The library reduces its motion and avoids smooth scrolling when that preference
is set. Your own animation, video, and application transitions need the same
consideration.

## Your pre-release checklist

- Read the rendered page without JavaScript.
- Check all themes and any locally scoped custom palette.
- Test the complete task with a keyboard, not just the first control.
- Confirm field labels, errors, status messages, and names with a screen reader.
- Check focus under sticky content and within scrollable regions.
- Try narrow layouts, enlarged text, long labels, and increased zoom.
- Run automated checks, investigate each finding, and record remaining limits.
- Test with the browsers and assistive technologies your audience actually uses.

Accessibility is ongoing work. A reproducible issue, a better example, or an
honest description of a limitation is a useful contribution.
