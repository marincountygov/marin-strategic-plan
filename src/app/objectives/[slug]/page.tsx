import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getParts, routeSlugsFor } from "@/lib/content/graph";
import type { ObjectiveSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Objective = z.infer<typeof ObjectiveSchema>;

export function generateStaticParams() {
  return routeSlugsFor("marin:Objective").map((slug) => ({ slug }));
}

export default async function ObjectivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const objective = getBySlug<Objective>("marin:Objective", slug);
  if (!objective) notFound();

  const strategies = getParts(objective);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={objective} />
      <Breadcrumbs node={objective} />
      <div className="mt-4">
        {objective["marin:status"] && <StatusBadge status={objective["marin:status"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {objective.name}
      </h1>
      <p className="mt-4 max-w-3xl font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {objective.description}
      </p>

      <dl className="mt-8 grid gap-6 sm:grid-cols-3">
        {objective["marin:baseline"] && (
          <div>
            <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
              Baseline
            </dt>
            <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
              {objective["marin:baseline"]}
            </dd>
          </div>
        )}
        {objective["marin:target"] && (
          <div>
            <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
              Target
            </dt>
            <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
              {objective["marin:target"]}
            </dd>
          </div>
        )}
        {objective["marin:dueDate"] && (
          <div>
            <dt className="font-product-body text-sm font-semibold text-marin-dark-gray dark:text-stone-400">
              Due date
            </dt>
            <dd className="mt-1 font-product-body text-base text-stone-900 dark:text-stone-50">
              {objective["marin:dueDate"]}
            </dd>
          </div>
        )}
      </dl>

      {objective["marin:successMeasures"] && (
        <div className="mt-8">
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Success measures
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 font-product-body text-base text-stone-700 dark:text-stone-300">
            {objective["marin:successMeasures"].map((measure) => (
              <li key={measure}>{measure}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <RelatedList heading="Strategies" items={strategies} />
      </div>
    </article>
  );
}
