/**
 * Single registry primary navigation reads from (site-config.ts maps this
 * straight into `nav`) so the header never hand-duplicates it.
 *
 * Collapsed to 3 hub pages — each introduces and links out to several of
 * the pages this list used to name directly (see src/app/plan,
 * src/app/progress, src/app/participate). Nothing was deleted; there's just
 * one less layer of top-level doors to it. The homepage's own link (site
 * name in the header) covers "Overview" implicitly.
 */
export interface Section {
  label: string;
  href: string;
}

export const NAV_SECTIONS: Section[] = [
  { label: "The Plan", href: "/plan" },
  { label: "Progress", href: "/progress" },
  { label: "Participate", href: "/participate" },
];
