/**
 * Validates every src/data/*.json file against its Zod schema. Run as part
 * of `npm run verify`, mirroring scripts/check-tokens.mjs's role for design
 * tokens — a content-shape gate the build depends on, not a suggestion.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_FILES } from "../src/lib/content/graph";
import { SCHEMA_BY_TYPE } from "../src/lib/content/schema";

const DATA_DIR = path.join(process.cwd(), "src/data");

let hasError = false;
const allIds = new Set<string>();
let nodeCount = 0;

for (const file of CONTENT_FILES) {
  const filePath = path.join(DATA_DIR, file);
  const doc = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  for (const node of doc["@graph"] ?? []) {
    const types: string[] = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    const schema = types.map((t) => SCHEMA_BY_TYPE[t]).find(Boolean);
    if (!schema) {
      console.error(
        `${file}: no schema registered for @type ${JSON.stringify(node["@type"])} (${node["@id"]})`,
      );
      hasError = true;
      continue;
    }
    const result = schema.safeParse(node);
    if (!result.success) {
      console.error(`${file}: ${node["@id"]} failed validation:`);
      for (const issue of result.error.issues) {
        console.error(`  ${issue.path.join(".")}: ${issue.message}`);
      }
      hasError = true;
      continue;
    }
    if (allIds.has(node["@id"])) {
      console.error(`${file}: duplicate @id ${node["@id"]}`);
      hasError = true;
    }
    allIds.add(node["@id"]);
    nodeCount++;
  }
}

if (hasError) {
  console.error("\ncontent validation failed");
  process.exit(1);
}

console.log(`content validation passed: ${nodeCount} nodes across ${CONTENT_FILES.length} files`);
