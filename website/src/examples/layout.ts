import { url } from "../lib/urls";

export const layoutStack = `<div class="lf-stack" style="--lf-gap: 1rem">
  <p class="lf-kicker">A little structure</p>
  <p>Use a stack when the relationship between items is vertical.</p>
  <div class="lf-cluster" style="--lf-gap: 0.5rem">
    <span class="lf-tag">Readable</span>
    <span class="lf-tag">Responsive</span>
    <span class="lf-tag">Composable</span>
  </div>
</div>`;

export const layoutGrid = `<div class="lf-grid" style="--lf-grid-min: 10rem; --lf-gap: 0.75rem">
  <div class="lf-alert">01 / Plan</div>
  <div class="lf-alert">02 / Build</div>
  <div class="lf-alert">03 / Review</div>
</div>`;

export const layoutFrame = `<div class="lf-shell">
  <div class="lf-frame">
    <div class="lf-container">
      <p>Quiet edges make the page structure visible.</p>
    </div>
  </div>
</div>`;

export const typography = `<div class="lf-stack">
  <p class="lf-kicker">Project handbook</p>
  <h3 class="lf-section__title">Start with the content.</h3>
  <p class="lf-lead">Give your ideas a clear hierarchy and enough room to breathe.</p>
  <div class="lf-meta">
    <span>Guide 01</span>
    <span>4 minute read</span>
  </div>
  <a class="lf-back-link" href="${url("docs/")}">
    <span class="lf-back-link__icon" aria-hidden="true">←</span>
    Back to the introduction
  </a>
</div>`;

export const heroMarkup = `<section class="lf-hero" aria-labelledby="project-heading">
  <p class="lf-hero__label">Project guide</p>
  <div>
    <h1 class="lf-display" id="project-heading">Make room for the work.</h1>
    <p class="lf-lead">A short, specific introduction belongs here.</p>
  </div>
</section>`;
