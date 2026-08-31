/**
 * One place to rename and rewire the site. Everything here is rendered by the
 * shell (header, footer, gov banner) and the metadata in src/app/layout.tsx.
 */
import { NAV_SECTIONS } from "@/lib/content/sections";

export const siteConfig = {
  /** Site name shown in the header, browser tab, and metadata. */
  name: "Marin Countywide Strategic Plan",
  /** One-sentence description for search engines and link previews. */
  description:
    "The County of Marin's strategic plan, as a living, structured product: goals, initiatives, KPIs, and progress, updated as the plan moves forward.",
  /** The county's main site, linked from the gov banner and footer. */
  countyUrl: "https://www.marincounty.gov",
  /** Primary navigation, generated from the content-section registry
   *  (src/lib/content/sections.ts) rather than hand-duplicated here. */
  nav: NAV_SECTIONS.map(({ label, href }) => ({ label, href })),
  /** Footer links. Accessibility and privacy pages are expected on every
   *  county site; keep those entries and build the pages out. */
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;
