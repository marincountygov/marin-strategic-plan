import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { ProgressBar } from "@/components/content/ProgressBar";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getParts, routeSlugsFor } from "@/lib/content/graph";
import type { StrategySchema } from "@/lib/content/schema";
import type { z } from "zod";

type Strategy = z.infer<typeof StrategySchema>;

export function generateStaticParams() {
  return routeSlugsFor("marin:Strategy").map((slug) => ({ slug }));
}

export default async function StrategyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const strategy = getBySlug<Strategy>("marin:Strategy", slug);
  if (!strategy) notFound();

  const initiatives = getParts(strategy);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={strategy} />
      <Breadcrumbs node={strategy} />
      <div className="mt-4">
        {strategy["marin:status"] && <StatusBadge status={strategy["marin:status"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {strategy.name}
      </h1>
      <p className="mt-4 max-w-3xl font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {strategy.description}
      </p>
      {typeof strategy["marin:progress"] === "number" && (
        <div className="mt-6 max-w-sm">
          <ProgressBar value={strategy["marin:progress"]} />
        </div>
      )}

      <div className="mt-10">
        <RelatedList heading="Initiatives" items={initiatives} />
      </div>
    </article>
  );
}
