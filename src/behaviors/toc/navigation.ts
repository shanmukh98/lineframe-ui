import { decodeFragment } from "./headings.js";

interface NavigationOptions {
  toc: HTMLElement;
  headings: readonly HTMLElement[];
  links: readonly HTMLAnchorElement[];
  update: () => void;
  signal: AbortSignal;
}

export function bindNavigation({
  toc,
  headings,
  links,
  update,
  signal,
}: NavigationOptions): () => void {
  const mobile = window.matchMedia("(max-width: 52rem)");
  const toggle = toc.querySelector<HTMLButtonElement>(".lf-toc__toggle");
  const mark = toc.querySelector(".lf-toc__toggle-mark");
  let frame = 0;
  const temporaryTabindexes = new Set<HTMLElement>();
  const restoreTabindex = (heading: HTMLElement) => {
    if (heading.getAttribute("tabindex") === "-1") heading.removeAttribute("tabindex");
    temporaryTabindexes.delete(heading);
  };

  const collapse = (value: boolean) => {
    toc.dataset.collapsed = String(value);
    toggle?.setAttribute("aria-expanded", String(!value));
    if (mark) mark.textContent = value ? "+" : "-";
  };
  const align = (heading: HTMLElement, focus = false) => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const previous = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      heading.scrollIntoView({ block: "start", behavior: "instant" });
      document.documentElement.style.scrollBehavior = previous;
      if (focus) {
        if (!heading.hasAttribute("tabindex")) {
          heading.setAttribute("tabindex", "-1");
          temporaryTabindexes.add(heading);
          heading.addEventListener("blur", () => restoreTabindex(heading), { once: true, signal });
        }
        heading.focus({ preventScroll: true });
      }
      update();
      frame = 0;
    });
  };
  const alignHash = () => {
    const id = decodeFragment(window.location.hash);
    const heading = headings.find((item) => item.id === id);
    if (heading) align(heading);
    else update();
  };

  collapse(mobile.matches && toggle !== null);
  toggle?.addEventListener(
    "click",
    () => {
      collapse(toc.dataset.collapsed !== "true");
    },
    { signal },
  );
  mobile.addEventListener("change", () => collapse(mobile.matches && toggle !== null), { signal });
  links.forEach((link, index) => {
    link.addEventListener(
      "click",
      (event) => {
        if (
          !mobile.matches ||
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        const heading = headings[index];
        if (!heading) return;
        event.preventDefault();
        collapse(toggle !== null);
        window.history.pushState(null, "", link.hash);
        align(heading, true);
      },
      { signal },
    );
  });
  window.addEventListener("hashchange", update, { signal });
  window.addEventListener(
    "popstate",
    () => {
      if (mobile.matches) alignHash();
    },
    { signal },
  );
  alignHash();
  document.fonts?.ready.then(() => {
    if (!signal.aborted) update();
  });
  return () => {
    window.cancelAnimationFrame(frame);
    for (const heading of temporaryTabindexes) restoreTabindex(heading);
  };
}
