import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/lib/content/schema";

// See StatusBadge.tsx for why these use the color ramps directly rather
// than the shared --color-success/--color-warning/--color-error tokens.
const PRIORITY_CLASSES: Record<Priority, string> = {
  Critical: "bg-marin-red-50 text-marin-red-700 dark:bg-marin-red-950 dark:text-marin-red-300",
  High: "bg-marin-gold-100 text-marin-gold-800 dark:bg-marin-gold-900 dark:text-marin-gold-200",
  Medium: "bg-marin-blue-50 text-marin-blue-700 dark:bg-marin-blue-950 dark:text-marin-blue-300",
  Low: "bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={`border-transparent ${PRIORITY_CLASSES[priority]}`}>
      {priority} priority
    </Badge>
  );
}
