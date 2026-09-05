import { activeSectionIndex } from "./active-section.js";
import { assignHeadingIds } from "./headings.js";
import { bindNavigation } from "./navigation.js";

const instances = new WeakMap<HTMLElement, () => void>();
const articles = new WeakMap<
  HTMLElement,
  { users: number; ready: string | null; height: string; heightPriority: string }
>();

function initialize(toc: HTMLElement): () => void {
  const existing = instances.get(toc);
  if (existing) return existing;
  // Another copy of the browser entry may already own this navigation.
  if (toc.dataset.lineframeTocReady === "true") return () => {};
  const article = toc.closest<HTMLElement>("[data-lineframe-article]");
  const prose = article?.querySelector<HTMLElement>("[data-lineframe-prose]");
  const list = toc.querySelector<HTMLElement>("[data-lineframe-toc-list]");
  if (!article || !prose || !list) {
    console.warn("[Lineframe] A TOC needs article, prose, and list data-lineframe hooks.");
    return () => {};
  }
  const headings = Array.from(prose.querySelectorAll<HTMLElement>("h2, h3"));
  const originalHidden = toc.hidden;
  if (headings.length < 2) {
    toc.hidden = true;
    let destroyed = false;
    const destroy = () => {
      if (destroyed) return;
      destroyed = true;
      toc.hidden = originalHidden;
      instances.delete(toc);
    };
    instances.set(toc, destroy);
    return destroy;
  }

  const listeners = new AbortController();
  const { signal } = listeners;
  const restoreIds = assignHeadingIds(headings);
  const originalCollapsed = toc.getAttribute("data-collapsed");
  let articleState = articles.get(article);
  if (!articleState) {
    articleState = {
      users: 0,
      ready: article.getAttribute("data-lineframe-toc-ready"),
      height: article.style.getPropertyValue("--lf-nav-height"),
      heightPriority: article.style.getPropertyPriority("--lf-nav-height"),
    };
    articles.set(article, articleState);
  }
  articleState.users++;
  const originalExpanded =
    toc.querySelector(".lf-toc__toggle")?.getAttribute("aria-expanded") ?? null;
  const originalMark = toc.querySelector(".lf-toc__toggle-mark")?.textContent ?? null;
  const originalList = [...list.childNodes];
  const links = headings.map((heading) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    item.className = `lf-toc__item${heading.tagName === "H3" ? " lf-toc__item--nested" : ""}`;
    link.className = "lf-toc__link";
    link.href = `#${encodeURIComponent(heading.id)}`;
    link.textContent = heading.textContent?.trim() ?? "";
    link.dataset.tocTarget = heading.id;
    item.append(link);
    return { item, link };
  });
  list.replaceChildren(...links.map(({ item }) => item));
  toc.hidden = false;
  toc.dataset.lineframeTocReady = "true";
  article.dataset.lineframeTocReady = "true";
  let frame = 0;
  let destroyed = false;
  let active = -1;

  const update = () => {
    if (destroyed) return;
    const header = document.querySelector(".lf-header")?.getBoundingClientRect().height ?? 0;
    const height = `${header}px`;
    if (article.style.getPropertyValue("--lf-nav-height") !== height) {
      // WebKit requires removal before replacing an !important custom property.
      article.style.removeProperty("--lf-nav-height");
      article.style.setProperty("--lf-nav-height", height);
    }
    const index = activeSectionIndex(
      headings.map((heading) => heading.getBoundingClientRect().top),
      header + 56,
      window.scrollY,
      window.innerHeight,
      document.documentElement.scrollHeight,
    );
    if (index !== active) {
      active = index;
      links.forEach(({ link }, position) => {
        if (position === index) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  };
  const requestUpdate = () => {
    if (!frame) {
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    }
  };
  update();
  const stopNavigation = bindNavigation({
    toc,
    headings,
    links: links.map(({ link }) => link),
    update,
    signal,
  });
  window.addEventListener("scroll", requestUpdate, { passive: true, signal });
  window.addEventListener("resize", requestUpdate, { signal });

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    listeners.abort();
    window.cancelAnimationFrame(frame);
    stopNavigation();
    restoreIds();
    list.replaceChildren(...originalList);
    toc.hidden = originalHidden;
    if (originalCollapsed === null) delete toc.dataset.collapsed;
    else toc.dataset.collapsed = originalCollapsed;
    const toggle = toc.querySelector(".lf-toc__toggle");
    if (originalExpanded === null) toggle?.removeAttribute("aria-expanded");
    else toggle?.setAttribute("aria-expanded", originalExpanded);
    const mark = toc.querySelector(".lf-toc__toggle-mark");
    if (mark) mark.textContent = originalMark;
    delete toc.dataset.lineframeTocReady;
    if (--articleState.users === 0) {
      article.style.removeProperty("--lf-nav-height");
      if (articleState.height)
        article.style.setProperty(
          "--lf-nav-height",
          articleState.height,
          articleState.heightPriority,
        );
      if (articleState.ready === null) delete article.dataset.lineframeTocReady;
      else article.dataset.lineframeTocReady = articleState.ready;
      articles.delete(article);
    }
    instances.delete(toc);
  };
  instances.set(toc, destroy);
  return destroy;
}

export function initToc(root?: ParentNode): () => void {
  if (typeof document === "undefined") {
    throw new Error("Lineframe initToc() must be called in a browser.");
  }
  const scope = root ?? document;
  const targets = Array.from(scope.querySelectorAll<HTMLElement>("[data-lineframe-toc]"));
  if (scope instanceof HTMLElement && scope.matches("[data-lineframe-toc]")) targets.unshift(scope);
  const cleanups = targets.map(initialize);
  return () => cleanups.forEach((cleanup) => cleanup());
}
