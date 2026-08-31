# AGENTS.md – County of Marin site template

Standards for anyone – human or agent – building a County of Marin website
from this template. These carry over from Engage Marin, the County's civic
engagement platform, where they shipped through a county accessibility audit.
Follow them; the CI in `.github/workflows/ci.yml` enforces the mechanical
parts.

## Stack

Next.js (App Router) + React + Tailwind CSS v4 + shadcn/ui, TypeScript
strict. Static export by default (`output: "export"` in `next.config.ts`), so
the built site in `out/` deploys to GitHub Pages, Vercel, or county
infrastructure. Server Components by default; client components only for
interactivity.

## Design tokens

- `src/app/globals.css` is the single source of truth for color, typography,
  spacing, radius, and shadow. The `/design-tokens` page renders it.
- **Never use arbitrary Tailwind values** (`bg-[#0777CF]`, `text-[13px]`,
  `w-[420px]`). Use the token utilities: `bg-marin-blue-500`,
  `text-marin-gold-700`, USWDS spacing/type variables.
  `npm run check:tokens` fails the build on violations.
- County palettes: `marin-blue` (primary), `marin-gold` (secondary),
  `marin-red` (destructive/error). Brand anchors (`marin-green`,
  `marin-brown`, `marin-dark-gray`, `marin-light-gray`) have no ramps – tint
  with opacity utilities or `color-mix()`.
- `marin-light-gray` is background/decorative only – 2.35:1 on white, never
  text. Secondary text is `text-marin-dark-gray` on county surfaces and
  `text-muted-foreground` on shadcn surfaces. `text-muted` does not exist –
  `--color-muted` is a background token.
- Typography: Jost (`font-product-display`) for headings, Open Sans
  (`font-product-body`) for body, IBM Plex Mono (`font-product-mono`) for
  code-like values only – never for labels or headings.

## Dark mode

Media-strategy only (`prefers-color-scheme`); nothing sets a `.dark` class.
**Every surface must be dark-paired** – an unpaired county token lands as
near-black text on a near-black surface. Pair surfaces to `stone-900/950`,
headings to `stone-50`, body to `stone-300`, muted to `stone-400`, county
tints to their `-950` counterparts. The footer and gov banner are dark in
both themes and hardcode light-on-dark colors.

## Accessibility – WCAG 2.2 AA, no exceptions

The DOJ's ADA Title II rule makes WCAG AA a legal requirement for county
websites, not a preference.

- Every interactive element is keyboard-operable with a visible focus
  indicator. The standard focus pattern (ring + offset, documented at the
  `--ring` token in `globals.css`): `focus-visible:ring-2
  focus-visible:ring-marin-blue-500 dark:focus-visible:ring-marin-blue-400
  focus-visible:ring-offset-2 focus-visible:ring-offset-white
  dark:focus-visible:ring-offset-stone-900`. Never `outline: none` without a
  replacement.
- Text contrast ≥ 4.5:1; UI component boundaries and focus indicators ≥ 3:1
  (use `border-field-border` for form controls).
- One `h1` per page; heading levels never skip. Landmarks: the shell provides
  skip link, `header`, `main`, `footer` – name any additional `nav`/`section`
  with `aria-label` or `aria-labelledby`.
- Images: meaningful ones get real `alt`; decorative ones get `alt=""` or
  `aria-hidden`.
- Motion respects `prefers-reduced-motion`, and auto-starting motion stops
  within 5 seconds (the shipped `animate-*` utilities already comply).
- Every new route goes into `ROUTES` in `e2e/a11y.spec.ts`. The axe scan is
  the floor, not the audit – keyboard-walk and screen-read new interactive
  work yourself.

## Components

- `src/components/ui/` is the vendored shadcn/ui set, themed to the county
  palette through `globals.css`. Add more with
  `npx shadcn@latest add <component>` – then re-check contrast and focus
  behavior; upstream defaults have needed fixes before (this set carries
  them).
- `src/components/layout/` is the county shell (gov banner, header, footer,
  skip link). Site identity lives in `src/lib/site-config.ts` – rename the
  site there, not by editing the shell.
- Compose from primitives before reaching for raw HTML; keep components
  Server Components unless they need state or events.

## Verification before done

`npm run verify` runs the full gate: lint, typecheck, token check, build,
and the accessibility suite (build the export first – the a11y tests serve
`out/`). All of it must pass before a change is finished. CI runs the same
gate on every push and PR.

## What not to do

- No arbitrary Tailwind values (enforced).
- No new fonts, colors, or spacing scales without updating `globals.css` and
  the `/design-tokens` page together.
- No `.dark` class theming – media strategy only.
- No committing `.env` files or secrets.
- No disabling the CI gates to get past a failure – fix the failure.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
