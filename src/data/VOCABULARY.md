# Content vocabulary

Every file in `src/data/` is a JSON-LD document: `{ "@context": ..., "@graph": [...] }`.
The `@context` is shared across both files (`src/lib/content/context.ts`):
Schema.org as the default vocabulary (`@vocab`), plus a `marin:` namespace at
`{BASE_URL}/vocab/` for the handful of concepts Schema.org has no type or
property for. This mirrors the pattern already used for JSON-LD elsewhere in
the county's repos (`sop-to-json`, `marin-docs/sop`).

Zod schemas for every type below live in `src/lib/content/schema.ts` — that
file is the enforced source of truth; this doc explains the *why* behind the
mapping.

The site is intentionally minimal right now: a homepage and an About page,
both driven entirely by `plan.json`, plus `communications.json` for the
"Stay connected" channels on the homepage. An earlier build had a much
larger content graph (goals, initiatives, KPIs, a full planning hierarchy,
an admin UI to edit it) — see git history if that's needed again; it was
removed to ship a smaller MVP first.

## Shared properties

Every node extends `BaseEntitySchema`, whichever `@type` it carries:

| Spec property | JSON-LD property | Notes |
| --- | --- | --- |
| id | `@id` | Full URL. |
| name | `name` | Schema.org native. |
| summary | `description` | Schema.org native — short. |
| description | `text` | Optional, longer prose. |
| status | `marin:status` | Enum, no Schema.org equivalent generic enough. |
| startDate | `startDate` | Schema.org native. |
| lastUpdated | `dateModified` | Schema.org native. |

## Homepage fields (`marin:StrategicPlan` only)

The short-term simplified homepage (three cards + "Make your voice heard" +
"Stay connected") reads from fields on the plan node so its copy is content,
not JSX:

- `marin:homeCards` — exactly 3 objects (`heading`, `body`, `linkLabel`,
  `linkHref`): Learn More, Get Involved, Impact.
- `marin:impactStats` — the "Envision Marin so far" stats band's data.
  Currently unused: that section is commented out on the homepage until
  there's a real engagement-numbers source to drive it.
- `marin:voiceActions` — the three time-tiered CTAs, each with its own `url`.

## Type mapping

| Section | `@type` | Why |
| --- | --- | --- |
| Strategic Plan (root) | `marin:StrategicPlan` | No Schema.org equivalent for a whole plan-as-entity. |
| Communication channel | `Service` \| `WebSite` \| `ContactPoint` | Engage Marin is a `Service` (participation platform), not social media; the site itself and social accounts are `WebSite`. |

## Adding a field or type

Add the property to the relevant Zod schema in `schema.ts` first, update the
data files, then update this table in the same change — the same
"docs and code together" bar `AGENTS.md` sets for design tokens.
