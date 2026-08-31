/**
 * One place to rename and rewire the site. Everything here is rendered by the
 * shell (header, footer, gov banner) and the metadata in src/app/layout.tsx.
 */
export const siteConfig = {
  /** Site name shown in the header, browser tab, and metadata. */
  name: "Your Site Name",
  /** One-sentence description for search engines and link previews. */
  description: "A County of Marin website.",
  /** The county's main site, linked from the gov banner and footer. */
  countyUrl: "https://www.marincounty.gov",
  /** Primary navigation. Keep it short; every item renders in the header. */
  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Design tokens", href: "/design-tokens" },
  ],
  /** Footer links. Accessibility and privacy pages are expected on every
   *  county site; keep those entries and build the pages out. */
  footerLinks: [
    { label: "About", href: "/about" },
    { label: "Accessibility", href: "/accessibility" },
    { label: "Privacy", href: "/privacy" },
  ],
} as const;
