import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { ReportSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Report = z.infer<typeof ReportSchema>;

export const metadata: Metadata = { title: "Reports" };

export default function ReportsPage() {
  const reports = getAll<Report>("Report");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={reports} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Reports
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Quarterly and annual progress reports generated from the same goal and KPI data on this site.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {reports.map((report) => (
          <EntityCard key={report["@id"]} node={report} />
        ))}
      </div>
    </div>
  );
}
