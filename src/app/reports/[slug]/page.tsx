import { notFound } from "next/navigation";
import Link from "next/link";
import { RelatedList } from "@/components/content/RelatedList";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getRelated, routeSlugsFor } from "@/lib/content/graph";
import type { ReportSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Report = z.infer<typeof ReportSchema>;

export function generateStaticParams() {
  return routeSlugsFor("Report").map((slug) => ({ slug }));
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const report = getBySlug<Report>("Report", slug);
  if (!report) notFound();

  const related = getRelated(report);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={report} />
      <p className="font-product-body text-sm font-medium text-marin-blue-700 dark:text-marin-blue-300">
        {report["marin:reportType"]} report · {report["marin:period"]}
      </p>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {report.name}
      </h1>
      <p className="mt-4 font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {report.description}
      </p>
      {report.url && (
        <Link
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          Download report
        </Link>
      )}

      <div className="mt-10">
        <RelatedList heading="Related" items={related} />
      </div>
    </article>
  );
}
