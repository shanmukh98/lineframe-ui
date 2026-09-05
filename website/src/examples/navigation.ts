import { asset, url } from "../lib/urls";

export const backLink = `<a class="lf-back-link" href="${url("docs/components/")}">
  <svg class="lf-icon lf-back-link__icon" aria-hidden="true">
    <use href="${asset("lineframe-icons.svg")}#arrow-left"></use>
  </svg>
  All components
</a>`;

export const pagination = `<nav class="lf-pagination" aria-label="Component guide pages">
  <a href="${url("docs/components/content/")}">Previous</a>
  <a href="${url("docs/components/layout/")}" aria-label="Page 1: Layout">1</a>
  <a href="${url("docs/components/content/")}" aria-label="Page 2: Content">2</a>
  <a href="${url("docs/components/navigation/")}" aria-current="page"
    aria-label="Page 3: Navigation">3</a>
  <span aria-disabled="true">Next</span>
</nav>`;

export const header = `<header class="lf-header">
  <div class="lf-header__inner">
    <a class="lf-brand" href="${url()}">
      <span class="lf-brand__mark" aria-hidden="true"></span>
      Project name
    </a>
    <nav class="lf-nav" aria-label="Primary">
      <a href="${url("docs/")}" aria-current="page">Guide</a>
      <a href="${url("docs/components/")}">Components</a>
    </nav>
  </div>
</header>`;

export const toc = `<article data-lineframe-article>
  <nav class="lf-toc" data-lineframe-toc
    aria-label="Example article sections" hidden>
    <p class="lf-toc__title">In this example</p>
    <button class="lf-toc__toggle" type="button" aria-expanded="false">
      <span>In this example</span>
      <span class="lf-toc__toggle-mark" aria-hidden="true">+</span>
    </button>
    <ol class="lf-toc__list" data-lineframe-toc-list></ol>
  </nav>
  <div class="lf-prose" data-lineframe-prose>
    <h3 id="example-structure">Start with a structure</h3>
    <p>A short outline gives a longer page a useful shape. The generated
      links let readers jump to each section with a keyboard or pointer.</p>
    <h3 id="example-reading">Make room for reading</h3>
    <p>Keep the prose narrow enough to follow. The table of contents is
      an enhancement; all of this content remains available without it.</p>
    <h3 id="example-finish">Finish with a next step</h3>
    <p>End with something useful: a related guide, a complete example,
      or a clear route back to where the reader started.</p>
  </div>
</article>`;

export const articleLayout = `<article class="lf-article">
  <div class="lf-article__layout" data-lineframe-article>
    <header class="lf-article__header">
      <h1 class="lf-article__title">Your article title</h1>
    </header>
    <aside class="lf-article__rail">
      <nav class="lf-toc" data-lineframe-toc aria-label="On this page" hidden>
        <p class="lf-toc__title">On this page</p>
        <button class="lf-toc__toggle" type="button" aria-expanded="false">
          <span>On this page</span>
          <span class="lf-toc__toggle-mark" aria-hidden="true">+</span>
        </button>
        <ol class="lf-toc__list" data-lineframe-toc-list></ol>
      </nav>
    </aside>
    <div class="lf-article__body">
      <div class="lf-prose" data-lineframe-prose>
        <h2 id="first-section">First section</h2>
        <p>Your content.</p>
        <h2 id="next-section">Next section</h2>
        <p>More useful content.</p>
      </div>
    </div>
  </div>
</article>`;
