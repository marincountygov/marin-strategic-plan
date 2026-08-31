/**
 * Mirrors every src/data/*.json collection into out/data/, plus one merged
 * out/data/graph.json containing the full @graph — a single fetchable
 * knowledge graph for AI agents and external tools, built from the exact
 * same files that render the site. Runs after `next build` (see
 * package.json's build script), so out/ already exists.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_FILES } from "../src/lib/content/graph";
import { JSONLD_CONTEXT } from "../src/lib/content/context";

const DATA_DIR = path.join(process.cwd(), "src/data");
const OUT_DIR = path.join(process.cwd(), "out/data");

fs.mkdirSync(OUT_DIR, { recursive: true });

const merged: Record<string, unknown>[] = [];

for (const file of CONTENT_FILES) {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, file), raw);
  const doc = JSON.parse(raw);
  merged.push(...(doc["@graph"] ?? []));
}

fs.writeFileSync(
  path.join(OUT_DIR, "graph.json"),
  JSON.stringify({ "@context": JSONLD_CONTEXT, "@graph": merged }, null, 2),
);

console.log(`generated out/data/graph.json with ${merged.length} nodes (${CONTENT_FILES.length} source files mirrored)`);
