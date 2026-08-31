# Marin Countywide Strategic Plan

The County of Marin's strategic plan as a structured, JSON-LD/Schema.org
website: every theme, goal, objective, initiative, KPI, and update is
version-controlled data in `src/data/`, and every page renders from it —
nothing is hardcoded. Built on
[marin-site-template](https://github.com/marincountygov/marin-site-template),
so County design tokens, accessible components, and CI accessibility gates
come from there.

- **Content** — `src/data/*.json`, one JSON-LD file per collection
  (themes, goals, objectives, strategies, initiatives, projects, milestones,
  deliverables, outcomes, KPIs, timeline phases, research, engagement,
  participants, communications, resources, updates, reports, governance).
  `src/data/VOCABULARY.md` documents the Schema.org / `marin:` type mapping.
- **Content graph** — `src/lib/content/graph.ts` loads and indexes every
  file by `@id`; `src/lib/content/routes.ts` maps any node to its URL. Pages
  never read `src/data/` directly.
- **Validation** — `npm run check:content` validates every file against the
  Zod schemas in `src/lib/content/schema.ts` and fails on a dangling `@id`
  reference.
- **Machine-readable output** — every page embeds its own JSON-LD; the build
  also emits `out/data/graph.json` (the full graph, merged) and
  `out/data/search-index.json` (flattened, for the in-browser search page).

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static export to `out/`, then generates `out/data/*.json` |
| `npm run preview` | Serve the built export locally |
| `npm run verify` | Lint + typecheck + token check + content check + build + a11y suite |
| `npm run check:content` | Validate `src/data/*.json` alone |
| `npm run test:a11y` | Accessibility suite alone (needs a fresh build) |

Requires Node 22+.

## Adding or editing content

1. Edit the relevant `src/data/*.json` file (or add a new node to an
   existing collection). Reference other nodes by `@id` — never duplicate
   data across files.
2. Run `npm run check:content` to validate.
3. `npm run dev` to see it rendered — new `[slug]` routes are picked up
   automatically via `generateStaticParams()`.
4. A new content *type* (not just a new entry) needs a Zod schema in
   `schema.ts`, a mapping entry in `VOCABULARY.md`, and — if it needs its
   own page — an entry in `src/lib/content/routes.ts`'s route tables.

## Deploying

Static export, so hosting is a choice. GitHub Pages workflow ships in
`.github/workflows/deploy-pages.yml` (off by default — enable Pages and set
the `DEPLOY_PAGES`/`BASE_PATH` repo variables). See `next.config.ts` for the
`NEXT_PUBLIC_BASE_PATH` note if serving from a subpath.

## Standards

Read `AGENTS.md` for the County design-token and accessibility standards
inherited from the template, and `CLAUDE.md` for what's specific to this
site's content architecture.
