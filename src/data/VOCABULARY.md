# Content vocabulary

Every file in `src/data/` is a JSON-LD document: `{ "@context": ..., "@graph": [...] }`.
The `@context` is shared across all files (`src/lib/content/context.ts`):
Schema.org as the default vocabulary (`@vocab`), plus a `marin:` namespace at
`{BASE_URL}/vocab/` for the handful of concepts Schema.org has no type or
property for. This mirrors the pattern already used for JSON-LD elsewhere in
the county's repos (`sop-to-json`, `marin-docs/sop`).

Zod schemas for every type below live in `src/lib/content/schema.ts` — that
file is the enforced source of truth; this doc explains the *why* behind the
mapping.

## Shared properties

Every major node extends `BaseEntitySchema`, whichever `@type` it carries:

| Spec property | JSON-LD property | Notes |
| --- | --- | --- |
| id / slug | `@id` | Full URL; the slug is the last path segment (`slugFromId()`). |
| name | `name` | Schema.org native. |
| summary | `description` | Schema.org native — short. |
| description | `text` | Optional, longer prose. |
| status | `marin:status` | Enum, no Schema.org equivalent generic enough. |
| owner | `marin:owner` | `@id` reference to a Participant node. |
| startDate / endDate | `startDate` / `endDate` | Schema.org native. |
| priority | `marin:priority` | Enum. |
| progress | `marin:progress` | Number, 0–100. |
| tags | `keywords` | Schema.org native. |
| relatedItems | `marin:relatedItems` | Array of `@id` refs — cross-links, not hierarchy. |
| lastUpdated | `dateModified` | Schema.org native. |

## Hierarchy: isPartOf / hasPart, not custom verbs

Theme → Goal → Objective → Strategy → Initiative → Project → Milestone →
Deliverable → Outcome → KPI is modeled with Schema.org's own `isPartOf`
(child → parent) and `hasPart` (parent → child). A generic JSON-LD consumer
already understands these two properties; inventing named verbs
(`supports`, `implementedBy`, `trackedBy`) for what is structurally the same
relationship would only fragment the graph. `marin:relatedItems` is reserved
for links that cross the hierarchy (a KPI pointing at the Outcome it
measures, an Update pointing at the Milestone it reports on).

## Type mapping

| Section | `@type` | Why |
| --- | --- | --- |
| Strategic Plan (root) | `marin:StrategicPlan` | No Schema.org equivalent for a whole plan-as-entity. |
| Strategic Theme | `marin:StrategicTheme` | No equivalent. |
| Goal | `marin:Goal` | No equivalent. |
| Objective | `marin:Objective` | No equivalent; carries `marin:baseline`/`marin:target`/`marin:dueDate`. |
| Strategy | `marin:Strategy` | No equivalent. |
| Initiative | `marin:Initiative` | No equivalent; carries `marin:risks`/`marin:dependencies`. |
| Project | `Project` | Schema.org has had `Project` since 2022 — used natively. |
| Milestone | `marin:Milestone` | No equivalent; carries required `marin:dueDate`. |
| Deliverable | `marin:Deliverable` | No equivalent. |
| Outcome | `marin:Outcome` | No equivalent. |
| KPI | `marin:KPI` | Carries `marin:unit`/`marin:baseline`/`marin:target`/`marin:currentValue`, plus a `marin:observations` array of native `Observation` nodes. |
| Timeline phase | `marin:PlanPhase` | No equivalent. |
| Research item | `Dataset` | Every research entry (survey, demographic study, existing-plan review, data source) uses `Dataset` uniformly, with `marin:researchType` carrying the subtype — keeps one `@type` → one schema. |
| Engagement activity | `Event` | Workshops, open houses, and meetings are natively `Event`. |
| Participant | `Person` \| `Organization` \| `GovernmentOrganization` \| `Audience` | `Audience` for participant classes like "residents" that aren't a single org. |
| Communication channel | `Service` \| `WebSite` \| `ContactPoint` | Engage Marin is a `Service` (participation platform), not social media. |
| Resource | `CreativeWork` | Downloads, presentations, and related-plan links. |
| Update | `BlogPosting` \| `NewsArticle` | `marin:category` distinguishes News/Progress Update/Board Action/Milestone Completion/Upcoming Event. |
| Report | `Report` | Quarterly/annual/progress/dashboard, via `marin:reportType`. |
| Governance | `marin:Governance` | A single composed node of Participant references by role, not a new participant type. |

## Adding a field or type

Add the property to the relevant Zod schema in `schema.ts` first, update the
data files, then update this table in the same change — the same
"docs and code together" bar `AGENTS.md` sets for design tokens.
