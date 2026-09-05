import { asset } from "../lib/urls";

export const alerts = `<div class="lf-stack">
  <div class="lf-alert lf-alert--info">
    <p class="lf-alert__title">A note before you begin</p>
    <p>These examples run entirely in your browser.</p>
  </div>
  <div class="lf-alert lf-alert--success">
    <p class="lf-alert__title">
      <svg class="lf-icon" aria-hidden="true">
        <use href="${asset("lineframe-icons.svg")}#check"></use>
      </svg>
      Ready to continue
    </p>
    <p>All required fields have been completed.</p>
  </div>
  <div class="lf-alert lf-alert--warning">
    <p class="lf-alert__title">Review before publishing</p>
    <p>This project will be visible to anyone with its link.</p>
  </div>
  <div class="lf-alert lf-alert--danger">
    <p class="lf-alert__title">The file could not be opened</p>
    <p>Choose a text file smaller than the upload limit.</p>
  </div>
</div>`;

export const badges = `<div class="lf-cluster">
  <span class="lf-badge">Draft</span>
  <span class="lf-badge lf-badge--info">In review</span>
  <span class="lf-badge lf-badge--success">Complete</span>
  <span class="lf-badge lf-badge--warning">Needs attention</span>
  <span class="lf-badge lf-badge--danger">Failed</span>
</div>`;

export const tags = `<div class="lf-cluster">
  <span class="lf-tag">CSS</span>
  <span class="lf-tag">Documentation</span>
  <span class="lf-tag">Open source</span>
</div>`;
