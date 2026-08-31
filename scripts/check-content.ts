/**
 * Validates every src/data/*.json file against its Zod schema and confirms
 * every @id reference (hasPart/isPartOf/marin:relatedItems/marin:owner/
 * governance role lists) resolves to a real node. Run as part of
 * `npm run verify`, mirroring scripts/check-tokens.mjs's role for design
 * tokens — a content-shape gate the build depends on, not a suggestion.
 */
import fs from "node:fs";
import path from "node:path";
import { CONTENT_FILES } from "../src/lib/content/graph";
import { SCHEMA_BY_TYPE } from "../src/lib/content/schema";

const DATA_DIR = path.join(process.cwd(), "src/data");

const REF_FIELDS = [
  "marin:owner",
  "marin:relatedItems",
  "hasPart",
  "isPartOf",
  "marin:executiveSponsor",
  "marin:steeringCommittee",
  "marin:planningTeam",
  "marin:decisionMakers",
  "marin:approvalMilestones",
];

let hasError = false;
const allIds = new Set<string>();
const allNodes: Record<string, unknown>[] = [];

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
    allNodes.push(node);
  }
}

for (const node of allNodes) {
  for (const field of REF_FIELDS) {
    const value = node[field];
    if (!value) continue;
    const refs = Array.isArray(value) ? value : [value];
    for (const ref of refs) {
      if (typeof ref === "string" && !allIds.has(ref)) {
        console.error(`${node["@id"]}: dangling reference in ${field} -> ${ref}`);
        hasError = true;
      }
    }
  }
}

if (hasError) {
  console.error("\ncontent validation failed");
  process.exit(1);
}

console.log(`content validation passed: ${allNodes.length} nodes across ${CONTENT_FILES.length} files`);
