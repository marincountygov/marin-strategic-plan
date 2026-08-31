import { Badge } from "@/components/ui/badge";
import type { Status } from "@/lib/content/schema";

// Named tokens only (bg-marin-*-NNN, text-marin-*-NNN) — every pair below is
// checked at >=4.5:1 in both light and dark. The shared --color-success/
// --color-warning/--color-error tokens in globals.css pair a mid-tone hue
// with its own light tint and land under 4:1 at badge text size, so status
// color here is built from the ramps directly rather than those tokens.
const STATUS_CLASSES: Record<Status, string> = {
  "Not Started": "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  Planning: "bg-marin-blue-50 text-marin-blue-700 dark:bg-marin-blue-950 dark:text-marin-blue-300",
  "In Progress": "bg-marin-blue-100 text-marin-blue-800 dark:bg-marin-blue-900 dark:text-marin-blue-200",
  "On Track": "bg-marin-gold-50 text-marin-gold-900 dark:bg-marin-gold-950 dark:text-marin-gold-300",
  "At Risk": "bg-marin-gold-100 text-marin-gold-800 dark:bg-marin-gold-900 dark:text-marin-gold-200",
  Blocked: "bg-marin-red-50 text-marin-red-700 dark:bg-marin-red-950 dark:text-marin-red-300",
  Completed: "bg-marin-gold-50 text-marin-gold-900 dark:bg-marin-gold-950 dark:text-marin-gold-300",
  Cancelled: "bg-stone-100 text-stone-700 line-through dark:bg-stone-800 dark:text-stone-300",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge variant="outline" className={`border-transparent ${STATUS_CLASSES[status]}`}>
      {status}
    </Badge>
  );
}
