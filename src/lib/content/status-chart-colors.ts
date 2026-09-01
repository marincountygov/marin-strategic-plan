import type { Status } from "./schema";

/**
 * Reserved status colors for chart marks (bars, dots) — deliberately fewer
 * and more separated than StatusBadge's 8 shades. A badge only needs to
 * read correctly on its own; a chart needs its marks pairwise distinct
 * against each other (adjacency CVD), and this design system has exactly
 * three brand hues (blue/gold/red) plus neutral gray — not eight — so
 * several of the 8 text statuses share one reserved bucket color here.
 * Validated with the dataviz skill's validator: CVD separation and the
 * normal-vision floor both pass for these four; the two WARN-level
 * standalone-contrast marks (gold, red) are mitigated by the icon+label
 * every bar in this chart always carries — never color alone.
 */
export type StatusBucket = "neutral" | "active" | "good" | "attention";

export const STATUS_BUCKET: Record<Status, StatusBucket> = {
  "Not Started": "neutral",
  Cancelled: "neutral",
  Planning: "active",
  "In Progress": "active",
  "On Track": "good",
  Completed: "good",
  "At Risk": "attention",
  Blocked: "attention",
};

export const STATUS_BUCKET_META: Record<
  StatusBucket,
  { label: string; barClass: string }
> = {
  neutral: { label: "Not started / cancelled", barClass: "bg-stone-500 dark:bg-stone-400" },
  active: { label: "Planning / in progress", barClass: "bg-marin-blue-600 dark:bg-marin-blue-400" },
  good: { label: "On track / completed", barClass: "bg-marin-gold-600 dark:bg-marin-gold-400" },
  attention: { label: "At risk / blocked", barClass: "bg-marin-red-600 dark:bg-marin-red-400" },
};
