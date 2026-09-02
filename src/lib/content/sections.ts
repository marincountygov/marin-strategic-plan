/**
 * Single registry primary navigation reads from (site-config.ts maps this
 * straight into `nav`) so the header never hand-duplicates it.
 */
export interface Section {
  label: string;
  href: string;
}

export const NAV_SECTIONS: Section[] = [{ label: "About", href: "/about" }];
