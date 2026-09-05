import { site } from "./site";

const base = `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/`;

export function url(path = ""): string {
  return `${base}${path.replace(/^\/+/, "")}`;
}

export function asset(path: string): string {
  return url(`assets/${path.replace(/^\/+/, "")}`);
}

export function sourceUrl(path: string, edit = false): string {
  const view = edit ? "edit" : path.endsWith("/") ? "tree" : "blob";
  const encodedPath = path
    .replace(/\/+$/, "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `${site.repository}/${view}/main/${encodedPath}`;
}
