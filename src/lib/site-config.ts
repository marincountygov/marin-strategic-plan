/**
 * One place to rename and rewire the site. Everything here is rendered by the
 * shell (header, footer, gov banner) and the metadata in src/app/layout.tsx.
 */
import { NAV_SECTIONS } from "@/lib/content/sections";

export const siteConfig = {
  /** Site name shown in the header, browser tab, and metadata. */
  name: "Envision Marin",
  /** One-sentence description for search engines and link previews. */
  description:
    "Envision Marin — the County of Marin's Countywide Strategic Plan. See what we're doing, share your ideas, and follow the impact of your input.",
  /** The county's main site, linked from the gov banner and footer. */
  countyUrl: "https://www.marincounty.gov",
  /** Primary navigation, generated from the content-section registry
   *  (src/lib/content/sections.ts) rather than hand-duplicated here. */
  nav: NAV_SECTIONS.map(({ label, href }) => ({ label, href })),
  /** Footer links. Accessibility and privacy pages are expected on every
   *  county site; keep those entries and build the pages out. */
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Data Explorer", href: "/json" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;
