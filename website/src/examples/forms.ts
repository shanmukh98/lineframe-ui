import { url } from "../lib/urls";

export const projectForm = `<form class="lf-stack" data-demo-form
  action="${url("docs/components/forms/")}#project-form" method="get"
  style="--lf-gap: 1.25rem">
  <div class="lf-field">
    <label class="lf-label" for="project-name">Project name (required)</label>
    <input class="lf-input" id="project-name" name="project"
      autocomplete="off" required maxlength="60"
      aria-describedby="project-name-hint">
    <p class="lf-hint" id="project-name-hint">Use a sample name for this local demo.</p>
  </div>
  <div class="lf-field">
    <label class="lf-label" for="project-visibility">Visibility</label>
    <select class="lf-select" id="project-visibility" name="visibility">
      <option value="private">Private</option>
      <option value="public">Public</option>
    </select>
  </div>
  <div class="lf-field">
    <label class="lf-label" for="project-summary">Short description</label>
    <textarea class="lf-textarea" id="project-summary" name="summary"
      rows="3" maxlength="240" aria-describedby="project-summary-hint"></textarea>
    <p class="lf-hint" id="project-summary-hint">Optional. Keep it under 240 characters.</p>
  </div>
  <label class="lf-choice">
    <input class="lf-checkbox" name="readme" type="checkbox" checked>
    Include a README
  </label>
  <div class="lf-cluster">
    <button class="lf-button lf-button--solid" type="submit">Check example</button>
    <button class="lf-button" type="reset">Reset fields</button>
  </div>
  <p class="lf-hint" data-demo-status role="status"></p>
</form>`;

export const formChoices = `<fieldset class="lf-field">
  <legend class="lf-label">Delivery frequency</legend>
  <label class="lf-choice">
    <input class="lf-radio" type="radio" name="frequency" value="weekly" checked>
    Weekly summary
  </label>
  <label class="lf-choice">
    <input class="lf-radio" type="radio" name="frequency" value="monthly">
    Monthly summary
  </label>
  <label class="lf-choice">
    <input class="lf-radio" type="radio" name="frequency" value="daily" disabled>
    Daily summary — not available
  </label>
</fieldset>`;

export const formError = `<form class="lf-stack" data-demo-form
  action="${url("docs/components/forms/")}#validation-example" method="get">
  <div class="lf-field">
    <label class="lf-label" for="sample-email">Email (required)</label>
    <input class="lf-input" id="sample-email" name="email"
      type="email" value="not-an-address" required
      aria-invalid="true" aria-describedby="sample-email-hint sample-email-error"
      data-demo-error="sample-email-error">
    <p class="lf-hint" id="sample-email-hint">Use a sample address, not your real email.</p>
    <p class="lf-error-text" id="sample-email-error">
      Enter a complete address, such as reader@example.com.
    </p>
  </div>
  <button class="lf-button" type="submit">Check address</button>
  <p class="lf-hint" data-demo-status role="status"></p>
</form>`;

export const formStates = `<div class="lf-stack">
  <div class="lf-field">
    <label class="lf-label" for="project-id">Project ID</label>
    <input class="lf-input" id="project-id" value="project-1042"
      readonly aria-describedby="project-id-hint">
    <p class="lf-hint" id="project-id-hint">Read-only. You can still select and copy it.</p>
  </div>
  <div class="lf-field">
    <label class="lf-label" for="project-region">Region</label>
    <select class="lf-select" id="project-region" disabled
      aria-describedby="project-region-hint">
      <option>Not available in this example</option>
    </select>
    <p class="lf-hint" id="project-region-hint">Disabled fields are not submitted.</p>
  </div>
</div>`;
