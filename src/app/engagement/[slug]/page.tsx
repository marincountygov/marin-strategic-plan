import { notFound } from "next/navigation";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getRelated, routeSlugsFor } from "@/lib/content/graph";
import type { EngagementActivitySchema } from "@/lib/content/schema";
import type { z } from "zod";

type EngagementActivity = z.infer<typeof EngagementActivitySchema>;

export function generateStaticParams() {
  return routeSlugsFor("Event").map((slug) => ({ slug }));
}

export default async function EngagementActivityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const activity = getBySlug<EngagementActivity>("Event", slug);
  if (!activity) notFound();

  const related = getRelated(activity);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={activity} />
      <div className="flex flex-wrap items-center gap-2">
        {activity["marin:status"] && <StatusBadge status={activity["marin:status"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {activity.name}
      </h1>
      <p className="mt-4 font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {activity.description}
      </p>

      <dl className="mt-6 space-y-2 font-product-body text-sm text-stone-700 dark:text-stone-300">
        {activity.startDate && (
          <div className="flex gap-2">
            <dt className="font-semibold text-marin-dark-gray dark:text-stone-400">Date</dt>
            <dd>{activity.startDate}</dd>
          </div>
        )}
        {activity.location && (
          <div className="flex gap-2">
            <dt className="font-semibold text-marin-dark-gray dark:text-stone-400">Location</dt>
            <dd>{activity.location}</dd>
          </div>
        )}
        {activity["marin:audience"] && (
          <div className="flex gap-2">
            <dt className="font-semibold text-marin-dark-gray dark:text-stone-400">Audience</dt>
            <dd>{activity["marin:audience"]}</dd>
          </div>
        )}
        {activity["marin:participationSummary"] && (
          <div className="flex gap-2">
            <dt className="font-semibold text-marin-dark-gray dark:text-stone-400">Participation</dt>
            <dd>{activity["marin:participationSummary"]}</dd>
          </div>
        )}
      </dl>

      {activity["marin:outcomes"] && (
        <div className="mt-6">
          <h2 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
            Outcomes
          </h2>
          <p className="mt-2 font-product-body text-base text-stone-700 dark:text-stone-300">
            {activity["marin:outcomes"]}
          </p>
        </div>
      )}

      <div className="mt-10">
        <RelatedList heading="Related goals" items={related} />
      </div>
    </article>
  );
}
