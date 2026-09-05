interface HeadingId {
  original: string | null;
  id: string;
  users: number;
}

const headingIds = new WeakMap<HTMLElement, HeadingId>();

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .trim()
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function assignHeadingIds(headings: readonly HTMLElement[]): () => void {
  const assigned = new Map<HTMLElement, HeadingId>();
  const used = new Set<string>();
  headings.forEach((heading, index) => {
    const existing = headingIds.get(heading);
    if (existing && heading.id === existing.id) {
      existing.users++;
      assigned.set(heading, existing);
      used.add(existing.id);
      return;
    }
    const original = heading.getAttribute("id");
    const base = original || slugify(heading.textContent ?? "") || `section-${index + 1}`;
    let id = base;
    let suffix = 2;
    while (
      used.has(id) ||
      (document.getElementById(id) && document.getElementById(id) !== heading)
    ) {
      id = `${base}-${suffix++}`;
    }
    heading.id = id;
    used.add(id);
    const ownership = { original, id, users: 1 };
    headingIds.set(heading, ownership);
    assigned.set(heading, ownership);
  });
  let released = false;
  return () => {
    if (released) return;
    released = true;
    for (const [heading, ownership] of assigned) {
      if (--ownership.users > 0 || headingIds.get(heading) !== ownership) continue;
      headingIds.delete(heading);
      const { original, id } = ownership;
      if (heading.id !== id) continue;
      if (original === null) heading.removeAttribute("id");
      else heading.id = original;
    }
  };
}

export function decodeFragment(hash: string): string | null {
  if (!hash || hash === "#") return null;
  try {
    return decodeURIComponent(hash.slice(1));
  } catch (error) {
    if (!(error instanceof URIError)) throw error;
    console.warn("[Lineframe] Ignoring a malformed URL fragment.");
    return null;
  }
}
