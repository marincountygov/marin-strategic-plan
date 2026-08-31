import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import type { KpiSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Kpi = z.infer<typeof KpiSchema>;

function percentToTarget(kpi: Kpi): number {
  const { "marin:baseline": baseline, "marin:target": target, "marin:currentValue": current } = kpi;
  if (target === baseline) return current >= target ? 100 : 0;
  const raw = ((current - baseline) / (target - baseline)) * 100;
  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function KpiDashboard({ kpis }: { kpis: Kpi[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {kpis.map((kpi) => (
        <div
          key={kpi["@id"]}
          id={kpi["@id"].split("/").pop()}
          className="scroll-mt-20 rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              {kpi.name}
            </h3>
            {kpi["marin:status"] && <StatusBadge status={kpi["marin:status"]} />}
          </div>
          <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
            {kpi.description}
          </p>

          <dl className="mt-4 grid grid-cols-3 gap-4 text-center font-product-mono text-sm">
            <div>
              <dt className="text-marin-dark-gray dark:text-stone-400">Baseline</dt>
              <dd className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-50">
                {kpi["marin:baseline"]} {kpi["marin:unit"]}
              </dd>
            </div>
            <div>
              <dt className="text-marin-dark-gray dark:text-stone-400">Current</dt>
              <dd className="mt-1 text-base font-semibold text-marin-blue-700 dark:text-marin-blue-300">
                {kpi["marin:currentValue"]} {kpi["marin:unit"]}
              </dd>
            </div>
            <div>
              <dt className="text-marin-dark-gray dark:text-stone-400">Target</dt>
              <dd className="mt-1 text-base font-semibold text-stone-900 dark:text-stone-50">
                {kpi["marin:target"]} {kpi["marin:unit"]}
              </dd>
            </div>
          </dl>

          <div className="mt-4">
            <ProgressBar value={percentToTarget(kpi)} label="Progress to target" />
          </div>

          {kpi["marin:observations"] && kpi["marin:observations"].length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer rounded font-product-body text-sm text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900">
                View reporting history
              </summary>
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {kpi["marin:observations"].map((observation) => (
                    <TableRow key={observation.observationDate}>
                      <TableCell>{observation.observationDate}</TableCell>
                      <TableCell>
                        {observation.value} {kpi["marin:unit"]}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
