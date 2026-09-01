import type { KpiSchema } from "./schema";
import type { z } from "zod";

type Kpi = z.infer<typeof KpiSchema>;

/** Percent of the way from baseline to target — shared by the Performance
 *  page's full dashboard and the /dashboard summary table. */
export function percentToTarget(kpi: Kpi): number {
  const { "marin:baseline": baseline, "marin:target": target, "marin:currentValue": current } = kpi;
  if (target === baseline) return current >= target ? 100 : 0;
  const raw = ((current - baseline) / (target - baseline)) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}
