import { asset, url } from "../lib/urls";

export const buttonLinks = `<div class="lf-cluster">
  <a class="lf-button lf-button--solid" href="${url("docs/installation/")}">
    Get started
    <svg class="lf-icon" aria-hidden="true">
      <use href="${asset("lineframe-icons.svg")}#arrow-right"></use>
    </svg>
  </a>
  <a class="lf-button" href="${url("docs/components/")}">Browse components</a>
  <a class="lf-button lf-button--quiet" href="${url("docs/philosophy/")}">Why Lineframe?</a>
</div>`;

export const buttonActions = `<form class="lf-stack" data-demo-form
  action="${url("docs/components/buttons/")}#button-actions" method="get">
  <div class="lf-field">
    <label class="lf-label" for="button-project">Project name</label>
    <input class="lf-input" id="button-project" name="project"
      value="Open atlas" required maxlength="60">
  </div>
  <div class="lf-cluster">
    <button class="lf-button lf-button--solid" type="submit">Check project</button>
    <button class="lf-button lf-button--quiet" type="reset">Reset</button>
    <button class="lf-button lf-button--danger" type="reset">Discard changes</button>
  </div>
  <p class="lf-hint" data-demo-status role="status">
    Edit the name, then check it or reset your changes.
  </p>
</form>`;

export const buttonSizes = `<div class="lf-cluster">
  <a class="lf-button lf-button--small" href="${url("docs/icons/")}">Small</a>
  <a class="lf-button" href="${url("docs/icons/")}">Default</a>
  <a class="lf-button lf-button--large" href="${url("docs/icons/")}">Large</a>
  <button class="lf-button" type="button" disabled>Unavailable</button>
</div>`;
