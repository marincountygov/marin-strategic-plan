import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { ProgressBar } from "@/components/content/ProgressBar";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getParts, getOwner, routeSlugsFor } from "@/lib/content/graph";
import type { InitiativeSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Initiative = z.infer<typeof InitiativeSchema>;

export function generateStaticParams() {
  return routeSlugsFor("marin:Initiative").map((slug) => ({ slug }));
}

export default async function InitiativePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initiative = getBySlug<Initiative>("marin:Initiative", slug);
  if (!initiative) notFound();

  const projects = getParts(initiative);
  const owner = getOwner(initiative);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={initiative} />
      <Breadcrumbs node={initiative} />
      <div className="mt-4">
        {initiative["marin:status"] && <StatusBadge status={initiative["marin:status"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {initiative.name}
      </h1>
      <p className="mt-4 max-w-3xl font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {initiative.description}
      </p>
      {owner && (
        <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
          Owned by {owner.name}
        </p>
      )}
      {typeof initiative["marin:progress"] === "number" && (
        <div className="mt-6 max-w-sm">
          <ProgressBar value={initiative["marin:progress"]} />
        </div>
      )}

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {initiative["marin:risks"] && (
          <div>
            <h2 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              Risks
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-product-body text-sm text-stone-700 dark:text-stone-300">
              {initiative["marin:risks"].map((risk) => (
                <li key={risk}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
        {initiative["marin:dependencies"] && (
          <div>
            <h2 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              Dependencies
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 font-product-body text-sm text-stone-700 dark:text-stone-300">
              {initiative["marin:dependencies"].map((dependency) => (
                <li key={dependency}>{dependency}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-10">
        <RelatedList heading="Projects" items={projects} />
      </div>
    </article>
  );
}
