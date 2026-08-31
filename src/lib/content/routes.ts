import { getById, getPartOf } from "./graph";
import { slugFromId } from "./context";
import type { BaseEntity } from "./schema";

/** Types with their own indexed route: /<prefix>/<slug>. */
const ROUTE_PREFIX_BY_TYPE: Record<string, string> = {
  "marin:StrategicTheme": "/themes",
  "marin:Goal": "/goals",
  "marin:Objective": "/objectives",
  "marin:Strategy": "/strategies",
  "marin:Initiative": "/initiatives",
  Project: "/projects",
  Dataset: "/research",
  Event: "/engagement",
  BlogPosting: "/updates",
  NewsArticle: "/updates",
  Report: "/reports",
};

/** Types rendered inline on a fixed index page, addressed by anchor. */
const ANCHOR_PAGE_BY_TYPE: Record<string, string> = {
  "marin:KPI": "/performance",
  Person: "/who-is-involved",
  Organization: "/who-is-involved",
  GovernmentOrganization: "/who-is-involved",
  Audience: "/who-is-involved",
  "marin:Governance": "/who-is-involved",
  Service: "/engagement",
  WebSite: "/engagement",
  ContactPoint: "/engagement",
  CreativeWork: "/resources",
};

function primaryType(node: BaseEntity): string {
  return Array.isArray(node["@type"]) ? node["@type"][0] : node["@type"];
}

/** The page a node's content actually renders on — never includes a hash.
 *  For types with no page of their own (Milestone, Deliverable, Outcome),
 *  walks isPartOf up until it finds an ancestor that has one. */
function pageUrlForNode(node: BaseEntity): string {
  if (node["@type"] === "marin:StrategicPlan") return "/";

  const type = primaryType(node);
  const prefix = ROUTE_PREFIX_BY_TYPE[type];
  if (prefix) return `${prefix}/${slugFromId(node["@id"])}`;

  const anchorPage = ANCHOR_PAGE_BY_TYPE[type];
  if (anchorPage) return anchorPage;

  const parents = getPartOf(node);
  if (parents[0]) return pageUrlForNode(parents[0]);

  return "/";
}

/** The site-relative URL for any node in the content graph — the one place
 *  this mapping lives, used by page routing, JsonLd links, breadcrumbs, and
 *  the search index generator alike. Types with their own route return that
 *  page directly; everything else returns the nearest ancestor's page with
 *  `#<slug>` appended — always a single anchor, never chained (an Outcome
 *  under a Deliverable under a Milestone still resolves to one `#slug` on
 *  the Project page, not three nested hashes). */
export function urlForNode(node: BaseEntity): string {
  const type = primaryType(node);
  if (type === "marin:StrategicPlan") return "/";
  if (ROUTE_PREFIX_BY_TYPE[type]) return pageUrlForNode(node);

  const slug = slugFromId(node["@id"]);
  return `${pageUrlForNode(node)}#${slug}`;
}

export function urlForId(nodeId: string): string | undefined {
  const node = getById(nodeId);
  return node ? urlForNode(node) : undefined;
}
