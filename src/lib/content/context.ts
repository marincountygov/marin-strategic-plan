/**
 * Canonical base URL for every @id in the content graph. GitHub Pages
 * project sites serve from a subpath, so this must match NEXT_PUBLIC_BASE_PATH
 * once the site is deployed under marincountygov/marin-strategic-plan.
 */
export const BASE_URL = "https://marincountygov.github.io/marin-strategic-plan";

/** Shared JSON-LD @context: Schema.org as the default vocabulary, plus the
 *  small marin: extension for types and properties Schema.org has no
 *  equivalent for. See src/data/VOCABULARY.md for the full type mapping. */
export const JSONLD_CONTEXT = {
  "@vocab": "https://schema.org/",
  marin: `${BASE_URL}/vocab/`,
} as const;
