import source from "../../../src/styles/tokens/accents.css?raw";
import type { Accent } from "./site";

const descriptions: Record<Accent, string> = {
  slate: "A cool, balanced starting point.",
  violet: "A subdued blue-violet for a little distinction.",
  moss: "An earthy green that stays in the background.",
  clay: "A warm counterpart to the paper canvas.",
};

export const palettes = (Object.keys(descriptions) as Accent[]).map((name) => {
  const declaration = source.match(
    new RegExp(`\\[data-lineframe-accent=["']?${name}["']?\\]\\s*\\{([^}]+)\\}`),
  )?.[1];
  const light = declaration?.match(/--lf-accent-light:\s*([^;]+);/)?.[1]?.trim();
  const dark = declaration?.match(/--lf-accent-dark:\s*([^;]+);/)?.[1]?.trim();

  if (!light || !dark) {
    throw new Error(`The documented ${name} palette is missing its source tokens.`);
  }

  return { name, description: descriptions[name], light, dark };
});
