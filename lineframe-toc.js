(() => {
  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const ensureHeadingIds = (headings) => {
    const used = new Set();

    headings.forEach((heading, index) => {
      const base = heading.id || slugify(heading.textContent) || `section-${index + 1}`;
      let id = base;
      let suffix = 2;

      while (used.has(id) || (document.getElementById(id) && document.getElementById(id) !== heading)) {
        id = `${base}-${suffix}`;
        suffix += 1;
      }

      heading.id = id;
      used.add(id);
    });
  };

  const initializeToc = (toc) => {
    const article = toc.closest("[data-lineframe-article]");
    const prose = article?.querySelector("[data-lineframe-prose]");
    const list = toc.querySelector("[data-lineframe-toc-list]");
    const toggle = toc.querySelector(".lf-toc__toggle");
    const toggleMark = toc.querySelector(".lf-toc__toggle-mark");

    if (!article || !prose || !list) return;

    const headings = Array.from(prose.querySelectorAll("h2, h3"));
    if (headings.length < 2) return;

    ensureHeadingIds(headings);

    const links = headings.map((heading) => {
      const item = document.createElement("li");
      const link = document.createElement("a");

      item.className = "lf-toc__item";
      if (heading.tagName === "H3") item.classList.add("lf-toc__item--nested");

      link.className = "lf-toc__link";
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent.trim();
      link.dataset.tocTarget = heading.id;

      item.append(link);
      list.append(item);
      return link;
    });

    toc.hidden = false;

    const mobileQuery = window.matchMedia("(max-width: 52rem)");

    const setCollapsed = (collapsed) => {
      toc.dataset.collapsed = String(collapsed);
      toggle?.setAttribute("aria-expanded", String(!collapsed));
      if (toggleMark) toggleMark.textContent = collapsed ? "+" : "-";
    };

    setCollapsed(mobileQuery.matches);

    let activeId = "";
    let ticking = false;

    const setActive = (id) => {
      if (!id || id === activeId) return;
      activeId = id;

      links.forEach((link) => {
        if (link.dataset.tocTarget === id) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const updateActive = () => {
      const headerOffset = document.querySelector(".lf-header")?.getBoundingClientRect().height || 68;
      const threshold = headerOffset + 56;
      let current = headings[0];

      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= threshold) current = heading;
      });

      setActive(current.id);
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActive);
    };

    const alignInitialHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = headings.find((heading) => heading.id === id);

      if (!target) {
        updateActive();
        return;
      }

      window.requestAnimationFrame(() => {
        const previousScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        target.scrollIntoView({ block: "start" });
        document.documentElement.style.scrollBehavior = previousScrollBehavior;
        window.requestAnimationFrame(updateActive);
      });
    };

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        setActive(link.dataset.tocTarget);
        if (!mobileQuery.matches) return;

        event.preventDefault();
        setCollapsed(true);

        const target = headings.find((heading) => heading.id === link.dataset.tocTarget);
        if (!target) return;

        window.history.pushState(null, "", link.hash);
        window.requestAnimationFrame(() => {
          const previousScrollBehavior = document.documentElement.style.scrollBehavior;
          document.documentElement.style.scrollBehavior = "auto";
          target.scrollIntoView({ block: "start" });
          document.documentElement.style.scrollBehavior = previousScrollBehavior;
          updateActive();
        });
      });
    });

    toggle?.addEventListener("click", () => {
      setCollapsed(toc.dataset.collapsed !== "true");
    });

    mobileQuery.addEventListener("change", (event) => {
      setCollapsed(event.matches);
    });

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", requestUpdate);
    alignInitialHash();
  };

  const initialize = () => {
    document.querySelectorAll("[data-lineframe-toc]").forEach(initializeToc);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
