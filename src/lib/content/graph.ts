import fs from "node:fs";
import path from "node:path";
import type { BaseEntity } from "./schema";
import type { StrategicPlanEntity } from "./schema";

/** The site's content files — just the plan itself plus the channels
 *  listed on the homepage. Everything else (goals, initiatives, KPIs, and
 *  the rest of the earlier content-graph model) was removed for the MVP;
 *  see git history if that structure is needed again. */
export const CONTENT_FILES = ["plan.json", "communications.json"] as const;

const DATA_DIR = path.join(process.cwd(), "src/data");

interface JsonLdDocument {
  "@context": unknown;
  "@graph": BaseEntity[];
}

function readJsonLd(file: string): JsonLdDocument {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as JsonLdDocument;
}

let nodesCache: BaseEntity[] | null = null;

function getAllNodes(): BaseEntity[] {
  if (!nodesCache) {
    nodesCache = CONTENT_FILES.flatMap((file) => readJsonLd(file)["@graph"]);
  }
  return nodesCache;
}

/** All nodes whose @type matches (string or array @type). */
export function getAll<T extends BaseEntity = BaseEntity>(type: string): T[] {
  return getAllNodes().filter((node) => {
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    return types.includes(type);
  }) as T[];
}

export function getPlan(): StrategicPlanEntity {
  const plan = getAll<StrategicPlanEntity>("marin:StrategicPlan")[0];
  if (!plan) throw new Error("src/data/plan.json is missing its marin:StrategicPlan node");
  return plan;
}
