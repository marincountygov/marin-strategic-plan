import fs from "node:fs";
import path from "node:path";
import { slugFromId } from "./context";
import { CONTENT_FILES } from "./content-files";
import type { BaseEntity, Status } from "./schema";
import type { StrategicPlanEntity } from "./schema";

export { CONTENT_FILES };

const DATA_DIR = path.join(process.cwd(), "src/data");

interface JsonLdDocument {
  "@context": unknown;
  "@graph": BaseEntity[];
}

function readJsonLd(file: string): JsonLdDocument {
  const raw = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
  return JSON.parse(raw) as JsonLdDocument;
}

/** Loads every src/data/*.json file once and indexes every node by @id.
 *  This is the only place content files are read from disk — pages and
 *  components always go through the getters below. */
function buildIndex(): Map<string, BaseEntity> {
  const index = new Map<string, BaseEntity>();
  for (const file of CONTENT_FILES) {
    const doc = readJsonLd(file);
    for (const node of doc["@graph"]) {
      index.set(node["@id"], node);
    }
  }
  return index;
}

let indexCache: Map<string, BaseEntity> | null = null;

function getIndex(): Map<string, BaseEntity> {
  if (!indexCache) indexCache = buildIndex();
  return indexCache;
}

/** All nodes whose @type matches (string or array @type). */
export function getAll<T extends BaseEntity = BaseEntity>(type: string): T[] {
  const results: T[] = [];
  for (const node of getIndex().values()) {
    const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    if (types.includes(type)) results.push(node as T);
  }
  return results;
}

export function getAllNodes(): BaseEntity[] {
  return Array.from(getIndex().values());
}

export function getById<T extends BaseEntity = BaseEntity>(nodeId: string): T | undefined {
  return getIndex().get(nodeId) as T | undefined;
}

export function getBySlug<T extends BaseEntity = BaseEntity>(
  type: string,
  slug: string,
): T | undefined {
  return getAll<T>(type).find((node) => slugFromId(node["@id"]) === slug);
}

/** Resolves isPartOf: the parent node(s) one level up the hierarchy. */
export function getPartOf(node: BaseEntity): BaseEntity[] {
  const refs = node.isPartOf;
  if (!refs) return [];
  const ids = Array.isArray(refs) ? refs : [refs];
  return ids.map((refId) => getById(refId)).filter((n): n is BaseEntity => Boolean(n));
}

/** Full ancestor chain, root first — used for breadcrumbs. */
export function getAncestorChain(node: BaseEntity): BaseEntity[] {
  const chain: BaseEntity[] = [];
  let current: BaseEntity | undefined = node;
  const seen = new Set<string>();
  while (current) {
    const parents = getPartOf(current);
    const parent = parents[0];
    if (!parent || seen.has(parent["@id"])) break;
    seen.add(parent["@id"]);
    chain.unshift(parent);
    current = parent;
  }
  return chain;
}

/** Resolves hasPart: the child nodes one level down the hierarchy. */
export function getParts(node: BaseEntity): BaseEntity[] {
  const refs = node.hasPart ?? [];
  return refs.map((refId) => getById(refId)).filter((n): n is BaseEntity => Boolean(n));
}

/** Resolves marin:relatedItems cross-links. */
export function getRelated(node: BaseEntity): BaseEntity[] {
  const refs = node["marin:relatedItems"] ?? [];
  return refs.map((refId) => getById(refId)).filter((n): n is BaseEntity => Boolean(n));
}

export function getOwner(node: BaseEntity): BaseEntity | undefined {
  const ownerId = node["marin:owner"];
  return ownerId ? getById(ownerId) : undefined;
}

export function getPlan(): StrategicPlanEntity {
  const plan = getAll<StrategicPlanEntity>("marin:StrategicPlan")[0];
  if (!plan) throw new Error("src/data/plan.json is missing its marin:StrategicPlan node");
  return plan;
}

export function getByStatus<T extends BaseEntity = BaseEntity>(
  type: string,
  status: Status,
): T[] {
  return getAll<T>(type).filter((node) => node["marin:status"] === status);
}

export function routeSlugsFor(type: string): string[] {
  return getAll(type).map((node) => slugFromId(node["@id"]));
}

/** Every src/data/*.json file with its own @graph nodes, in CONTENT_FILES
 *  order — for the /json content browser, where each file is its own
 *  section. Nothing else needs file-level grouping (getAllNodes()/getAll()
 *  already merge across files), so this is kept separate from the index. */
export function getContentByFile(): { file: string; nodes: BaseEntity[] }[] {
  return CONTENT_FILES.map((file) => ({ file, nodes: readJsonLd(file)["@graph"] }));
}
