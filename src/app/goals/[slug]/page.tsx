import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { PriorityBadge } from "@/components/content/PriorityBadge";
import { ProgressBar } from "@/components/content/ProgressBar";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getParts, getOwner, getRelated, routeSlugsFor } from "@/lib/content/graph";
import type { GoalSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Goal = z.infer<typeof GoalSchema>;

export function generateStaticParams() {
  return routeSlugsFor("marin:Goal").map((slug) => ({ slug }));
}

export default async function GoalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const goal = getBySlug<Goal>("marin:Goal", slug);
  if (!goal) notFound();

  const objectives = getParts(goal);
  const owner = getOwner(goal);
  const kpis = getRelated(goal);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={goal} />
      <Breadcrumbs node={goal} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {goal["marin:status"] && <StatusBadge status={goal["marin:status"]} />}
        {goal["marin:priority"] && <PriorityBadge priority={goal["marin:priority"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {goal.name}
      </h1>
      <p className="mt-4 max-w-3xl font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {goal.description}
      </p>
      {owner && (
        <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
          Owned by {owner.name}
        </p>
      )}
      {typeof goal["marin:progress"] === "number" && (
        <div className="mt-6 max-w-sm">
          <ProgressBar value={goal["marin:progress"]} />
        </div>
      )}

      <div className="mt-10 space-y-10">
        <RelatedList heading="Objectives" items={objectives} />
        <RelatedList heading="Performance measures" items={kpis} />
      </div>
    </article>
  );
}
