import type { Metadata } from "next";
import { KpiDashboard } from "@/components/content/KpiDashboard";
import { JsonLd } from "@/components/content/JsonLd";
import { RelatedList } from "@/components/content/RelatedList";
import { getAll } from "@/lib/content/graph";
import type { KpiSchema, ReportSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Kpi = z.infer<typeof KpiSchema>;
type Report = z.infer<typeof ReportSchema>;

export const metadata: Metadata = { title: "Performance" };

export default function PerformancePage() {
  const kpis = getAll<Kpi>("marin:KPI");
  const reports = getAll<Report>("Report");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={kpis} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Performance
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Key performance indicators for every goal, with baseline, current value, target, and reporting history.
      </p>
      <div className="mt-10">
        <KpiDashboard kpis={kpis} />
      </div>
      <div className="mt-12">
        <RelatedList heading="Reports" items={reports} />
      </div>
    </div>
  );
}
