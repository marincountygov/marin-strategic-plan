/**
 * Flattens every node in the content graph into out/data/search-index.json
 * — the org's existing search pattern (marin-docs/search) is a small
 * client-side filter over a pre-built JSON index, not a search library, and
 * this site follows the same approach rather than introducing a new
 * dependency for what is, structurally, the same small-dataset problem.
 */
import fs from "node:fs";
import path from "node:path";
import { getAllNodes } from "../src/lib/content/graph";
import { urlForNode } from "../src/lib/content/routes";

const OUT_DIR = path.join(process.cwd(), "out/data");
fs.mkdirSync(OUT_DIR, { recursive: true });

const entries = getAllNodes().map((node) => ({
  id: node["@id"],
  type: Array.isArray(node["@type"]) ? node["@type"][0] : node["@type"],
  name: node.name,
  summary: node.description,
  tags: node.keywords ?? [],
  url: urlForNode(node),
}));

fs.writeFileSync(path.join(OUT_DIR, "search-index.json"), JSON.stringify(entries, null, 2));

console.log(`generated out/data/search-index.json with ${entries.length} entries`);
