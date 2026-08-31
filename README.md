# County of Marin site template

Starter template for County of Marin websites. It packages the design system
built for [Engage Marin](https://engage.marincounty.gov) – county design
tokens, accessible UI components, the government shell, and CI checks that
enforce the standards – so a new County site starts above the bar instead of
rebuilding it.

- **Design tokens** – Marin blue/gold/red ramps, county brand anchors, USWDS
  spacing and type scales, Jost / Open Sans / IBM Plex Mono. One source of
  truth in `src/app/globals.css`, rendered at `/design-tokens`.
- **Components** – shadcn/ui primitives themed to the county palette, plus
  the county shell (gov banner, header, footer, skip link).
- **Checks** – lint, typecheck, a token-usage gate, and an automated WCAG
  2.2 AA scan run locally (`npm run verify`) and in CI on every push.
- **Standards** – `AGENTS.md` carries the county conventions for humans and
  AI agents alike.

## Using this template

1. Click **Use this template** on GitHub (or `gh repo create <name>
   --template <this-repo>`).
2. `npm install`
3. Edit `src/lib/site-config.ts` – site name, description, nav, footer
   links. The shell and metadata pick it up everywhere.
4. `npm run dev` and build your pages in `src/app/`.
5. Before shipping anything: `npm run verify`.

Requires Node 22+.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Static export to `out/` |
| `npm run preview` | Serve the built export locally |
| `npm run verify` | Lint + typecheck + token check + build + a11y suite |
| `npm run test:a11y` | Accessibility suite alone (needs a fresh build) |
| `npx shadcn@latest add <component>` | Add more UI primitives |

## Deploying

The template builds to static files, so hosting is a choice, not a fork.

**GitHub Pages** – a ready workflow ships in
`.github/workflows/deploy-pages.yml`, off by default. Enable Pages
(Settings → Pages → Source: GitHub Actions), set the repo variable
`DEPLOY_PAGES` to `true`, and – if serving from a subpath like
`org.github.io/repo-name` – set `BASE_PATH` to `/repo-name`.

**Vercel** – import the repo; the static export is detected automatically.
Removing `output: "export"` from `next.config.ts` later unlocks server
features (API routes, server actions) with no other changes.

## Standards

Read `AGENTS.md` before building. Short version: style only with the tokens
in `globals.css` (CI rejects arbitrary Tailwind values), pair every surface
for dark mode, keep WCAG 2.2 AA on everything, and add each new route to the
accessibility scan in `e2e/a11y.spec.ts`.

## Provenance

Extracted from the Engage Marin codebase, where these tokens and components
shipped through a county accessibility audit. The Engage Marin repo remains
the reference implementation; this template is versioned independently.
