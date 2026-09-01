# CLAUDE.md – marin-strategic-plan

@AGENTS.md

This is the County of Marin Strategic Plan website, built from
`marin-site-template`. AGENTS.md carries the template's design-token,
accessibility, and component standards; they apply here unchanged.

**This repo does not use `marin-ui`, `marin-skills`, or
`marin-digital-standards`.** Those govern a different family of Marin
projects — zero-build static HTML apps built from `marin-app-template`
(`marin-expense`, `marin-cupa-fees`, `marin-decision-maker`, and similar),
which vendor `marin-ui`'s brand bundle via `sync-consumer.sh` and follow
`marin-skills`' SKILL.md playbooks. This repo is a Next.js/React/Tailwind
site with its own independent, self-contained stack and standards, entirely
inherited from `marin-site-template`'s own AGENTS.md above — nothing here
should reference `marin-ui` components, sync a `BRAND_VERSION`, or defer to
a `marin-skills` skill for review or verification. If a task or a stray file
here starts to look like that other pattern (a `marin.yml`, a
`shared/app-brand.css`, a `sync-marin-ui-*` branch), that's a sign of
cross-contamination from working across both project families in the same
session — flag it rather than carrying it through.

## What makes this repo different from the template

The entire site renders from structured content, not hardcoded pages:

- All content lives as JSON-LD under `src/data/` — one file per entity
  collection (`goals.json`, `initiatives.json`, `kpis.json`, etc.), each a
  `{ "@context": ..., "@graph": [...] }` document. See
  `src/data/VOCABULARY.md` for the full Schema.org/`marin:` type mapping.
- `src/lib/content/graph.ts` is the only module that reads `src/data/*.json`.
  Every page imports typed entities from it — never read a data file
  directly from a page or component.
- Relationships are `@id` references resolved at render time
  (`isPartOf`/`hasPart` for the planning hierarchy, `marin:relatedItems` for
  cross-links). Never duplicate data between JSON files.
- `npm run check:content` (part of `npm run verify`) validates every JSON
  file against its Zod schema in `src/lib/content/schema.ts` and fails the
  build on a dangling `@id` reference.
- Primary navigation comes from `src/lib/content/sections.ts`, not a
  hand-written list in `site-config.ts`.
- New content types or fields: add the Zod schema in `schema.ts`, the data
  file in `src/data/`, and a mapping entry in `VOCABULARY.md` together — the
  same "update docs and code in the same change" bar AGENTS.md sets for
  design tokens.
