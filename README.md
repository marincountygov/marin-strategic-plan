# Marin Countywide Strategic Plan

Envision Marin — the County of Marin's Countywide Strategic Plan site, live
at [envisionmarin.com](https://envisionmarin.com). A small, content-driven
MVP: a homepage and an About page, both rendered from JSON-LD/Schema.org
data in `src/data/` rather than hardcoded copy, so approved comms language
can be swapped in without touching page code. Built on
[marin-site-template](https://github.com/marincountygov/marin-site-template),
so County design tokens, accessible components, and CI accessibility gates
come from there.

- **Content** — `src/data/plan.json` (the one `marin:StrategicPlan` node
  driving both pages: hero copy, homepage cards, "Make your voice heard,"
  the About page's sections, and the newsletter CTA) and
  `src/data/communications.json` (the channels listed on the homepage's
  "Follow us"). `src/data/VOCABULARY.md` documents the Schema.org / `marin:`
  type mapping. An earlier build of this repo had a much larger content
  graph (goals, initiatives, KPIs, a full planning hierarchy, dozens of
  pages, a forms-based `/admin` editor) — see git history if that's needed
  again; it was removed to ship this smaller MVP first.
- **Content loading** — `src/lib/content/graph.ts` is the only module that
  reads `src/data/*.json`; pages never read it directly.
- **Validation** — `npm run check:content` validates both files against the
  Zod schemas in `src/lib/content/schema.ts`.
- **Machine-readable output** — every page embeds its own JSON-LD; the build
  also emits `out/data/*.json` mirroring the source files, plus a merged
  `out/data/graph.json`.
- **Access** — the whole site sits behind a casual, client-side password
  gate (`src/lib/site-lock.ts`) while it's pre-launch — see that file's own
  comment for why it's not real access control, and how to change the
  password.

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

## Editing content

1. Edit `src/data/plan.json` or `src/data/communications.json`. Run
   `npm run check:content` to validate against `schema.ts`.
2. `npm run dev` to see it rendered.
3. A new field needs a matching change to the Zod schema in `schema.ts` and
   a mapping entry in `VOCABULARY.md`, in the same change.

## Deploying

Static export, so hosting is a choice. The live site deploys via the
GitHub Pages workflow in `.github/workflows/deploy-pages.yml` (enabled via
the `DEPLOY_PAGES` repo variable) to the custom domain `envisionmarin.com`.
Because it's a custom domain serving from the root — not a
`org.github.io/repo-name` subpath — the `BASE_PATH` repo variable is unset;
only set it if this ever moves back to a subpath deploy (see
`next.config.ts`'s `NEXT_PUBLIC_BASE_PATH` note). Any static asset
referenced outside `next/link`/`next/image`'s automatic path rewriting
(e.g. a raw `<img>`/`next/image` `src` string) must be prefixed by hand with
`BASE_PATH` from `src/lib/base-path.ts` — `images.unoptimized` (required for
static export) skips the optimizer route that would otherwise carry it.

## Standards

Read `AGENTS.md` for the County design-token and accessibility standards
inherited from the template, and `CLAUDE.md` for what's specific to this
site's content architecture.
