import type { ReactNode } from "react";

export interface BarChartRow {
  key: string;
  label: ReactNode;
  /** 0–100, the fill's share of the track. */
  percent: number;
  /** Shown at the bar's tip — already-formatted (e.g. "3", "42%"). */
  displayValue: string;
  /** Tailwind bg-* class (with a dark: pair) for the fill. */
  barClassName: string;
}

/**
 * A horizontal magnitude/status bar chart, built in plain HTML per the
 * dataviz skill: <=24px-thick bars, square baseline, 4px rounded tip, a 2px
 * surface gap between the fill and its track. The value is always a direct
 * label (never hidden behind hover) — with 3–4 rows this reads better than
 * a legend, and it's what keeps every value reachable without pointer
 * interaction. The row itself is focusable and lifts on hover/focus so it
 * still responds the way the skill's interaction spec expects.
 */
export function HorizontalBarChart({ rows }: { rows: BarChartRow[] }) {
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div
          key={row.key}
          tabIndex={0}
          className="group -mx-1 flex items-center gap-3 rounded-md px-1 py-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          <div className="w-40 shrink-0 font-product-body text-sm text-stone-900 dark:text-stone-100">
            {row.label}
          </div>
          <div className="h-5 flex-1 rounded-sm bg-stone-100 dark:bg-stone-800">
            <div
              className={`h-5 rounded-r-sm transition-[filter] group-hover:brightness-110 group-focus-visible:brightness-110 ${row.barClassName}`}
              style={{ width: `${Math.min(100, Math.max(0, row.percent))}%` }}
            />
          </div>
          <div className="w-12 shrink-0 text-right font-product-body text-sm font-semibold text-stone-900 dark:text-stone-100">
            {row.displayValue}
          </div>
        </div>
      ))}
    </div>
  );
}
