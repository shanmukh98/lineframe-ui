import { url } from "../lib/urls";

export const cards = `<div class="lf-card-grid">
  <a class="lf-card" href="${url("docs/installation/")}">
    <h3 class="lf-card__title">Start small</h3>
    <p class="lf-card__text">Add the stylesheet and build your first page.</p>
  </a>
  <a class="lf-card" href="${url("docs/tokens/")}">
    <h3 class="lf-card__title">Find your tone</h3>
    <p class="lf-card__text">Choose a palette and understand the design tokens.</p>
  </a>
</div>`;

export const table = `<div class="lf-table-wrap" role="region"
  aria-label="Example project milestones" tabindex="0">
  <table class="lf-table">
    <caption>Project milestones — example data</caption>
    <thead>
      <tr>
        <th scope="col">Milestone</th>
        <th scope="col">Owner</th>
        <th scope="col">Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Content outline</th>
        <td>Editorial team</td>
        <td><span class="lf-badge lf-badge--success">Complete</span></td>
      </tr>
      <tr>
        <th scope="row">Keyboard review</th>
        <td>Interface team</td>
        <td><span class="lf-badge lf-badge--info">In review</span></td>
      </tr>
    </tbody>
  </table>
</div>`;

export const disclosure = `<details class="lf-disclosure">
  <summary>Does this component need JavaScript?</summary>
  <p>No. This disclosure uses the browser's native details and summary elements.</p>
  <p>Open or close it with a click, Enter, or Space when the summary is focused.</p>
</details>`;

export const prose = `<div class="lf-prose">
  <h3>Write for the reader</h3>
  <p>A good interface makes <strong>the important thing</strong> easy to find.
    Keep your <a href="${url("docs/accessibility/")}">link text descriptive</a>.</p>
  <blockquote>
    <p>Structure helps people scan. Plain language helps them understand.</p>
  </blockquote>
  <ul>
    <li>Start with a useful heading.</li>
    <li>Keep paragraphs focused.</li>
    <li>Use <code>semantic HTML</code> before adding presentation.</li>
  </ul>
</div>`;

export const contentList = `<ol class="lf-post-list">
  <li class="lf-post-list__item">
    <a class="lf-post-link" href="${url("docs/installation/")}">
      <span class="lf-post-link__index" aria-hidden="true">01</span>
      <span>
        <span class="lf-post-link__title">Set up your project</span>
        <span class="lf-post-link__summary">Choose a CDN or a self-hosted installation.</span>
      </span>
      <span class="lf-post-link__date">Guide</span>
    </a>
  </li>
  <li class="lf-post-list__item">
    <a class="lf-post-link" href="${url("docs/components/")}">
      <span class="lf-post-link__index" aria-hidden="true">02</span>
      <span>
        <span class="lf-post-link__title">Build an interface</span>
        <span class="lf-post-link__summary">Combine small, reusable components.</span>
      </span>
      <span class="lf-post-link__date">Reference</span>
    </a>
  </li>
</ol>`;
