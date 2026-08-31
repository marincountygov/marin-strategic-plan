/**
 * Single registry of top-level content sections. Primary navigation
 * (site-config.ts), breadcrumb root labels, and section metadata all read
 * from this list instead of being hand-duplicated across the shell and the
 * content — this is what "navigation generated from the data model" means
 * in a site with a small, fixed set of section types.
 */
export interface Section {
  label: string;
  href: string;
  /** The @type this section lists, when it's a content-type index page. */
  contentType?: string;
}

export const NAV_SECTIONS: Section[] = [
  { label: "Overview", href: "/" },
  { label: "Vision", href: "/vision" },
  { label: "Strategic Themes", href: "/themes", contentType: "marin:StrategicTheme" },
  { label: "Goals", href: "/goals", contentType: "marin:Goal" },
  { label: "Timeline", href: "/timeline", contentType: "marin:PlanPhase" },
  { label: "Performance", href: "/performance", contentType: "marin:KPI" },
  { label: "Research", href: "/research", contentType: "Dataset" },
  { label: "Engagement", href: "/engagement", contentType: "Event" },
  { label: "Who's Involved", href: "/who-is-involved" },
  { label: "News and Updates", href: "/updates", contentType: "BlogPosting" },
  { label: "Resources", href: "/resources", contentType: "CreativeWork" },
  { label: "About", href: "/about" },
];
