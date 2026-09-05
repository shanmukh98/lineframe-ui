import { version } from "../../../package.json";

const repository = "https://github.com/shanmukh98/lineframe-ui";

export const site = {
  name: "Lineframe UI",
  version,
  description:
    "A small, framework-agnostic UI library. Readable type, quiet frames, native components, and room for your content.",
  repository,
  cdn: `https://cdn.jsdelivr.net/gh/shanmukh98/lineframe-ui@v${version}`,
  release: `${repository}/releases/download/v${version}/shanmukh98-lineframe-ui-${version}.tgz`,
} as const;

export type Accent = "slate" | "violet" | "moss" | "clay";

export const navigation = [
  {
    title: "Start here",
    links: [
      { title: "Introduction", path: "docs/" },
      { title: "Installation", path: "docs/installation/" },
      { title: "Tokens & themes", path: "docs/tokens/" },
    ],
  },
  {
    title: "Build with Lineframe",
    links: [
      { title: "Components", path: "docs/components/" },
      { title: "Layout & typography", path: "docs/components/layout/" },
      { title: "Buttons", path: "docs/components/buttons/" },
      { title: "Forms", path: "docs/components/forms/" },
      { title: "Feedback", path: "docs/components/feedback/" },
      { title: "Content", path: "docs/components/content/" },
      { title: "Navigation", path: "docs/components/navigation/" },
      { title: "Icons", path: "docs/icons/" },
      { title: "JavaScript APIs", path: "docs/javascript/" },
    ],
  },
  {
    title: "Make it yours",
    links: [
      { title: "Accessibility", path: "docs/accessibility/" },
      { title: "Philosophy & credits", path: "docs/philosophy/" },
      { title: "Contributing", path: "docs/contributing/" },
    ],
  },
] as const;

export const componentGroups = [
  {
    title: "Layout & typography",
    path: "docs/components/layout/",
    description: "Frames, reading widths, flexible stacks, and a clear type hierarchy.",
    icon: "menu",
  },
  {
    title: "Buttons",
    path: "docs/components/buttons/",
    description: "Real links for going places. Native buttons for doing things.",
    icon: "arrow-right",
  },
  {
    title: "Forms",
    path: "docs/components/forms/",
    description: "Labeled fields, useful hints, and honest validation states.",
    icon: "check",
  },
  {
    title: "Feedback",
    path: "docs/components/feedback/",
    description: "Quiet alerts and compact badges that say more than a color.",
    icon: "info",
  },
  {
    title: "Content",
    path: "docs/components/content/",
    description: "Cards, tables, disclosures, and long-form prose.",
    icon: "copy",
  },
  {
    title: "Navigation",
    path: "docs/components/navigation/",
    description: "Headers, back links, pagination, and an optional article TOC.",
    icon: "arrow-left",
  },
] as const;
