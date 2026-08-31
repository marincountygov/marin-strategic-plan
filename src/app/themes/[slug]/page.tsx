import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { RelatedList } from "@/components/content/RelatedList";
import { StatusBadge } from "@/components/content/StatusBadge";
import { ProgressBar } from "@/components/content/ProgressBar";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getParts, getOwner, routeSlugsFor } from "@/lib/content/graph";
import type { ThemeSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Theme = z.infer<typeof ThemeSchema>;

export function generateStaticParams() {
  return routeSlugsFor("marin:StrategicTheme").map((slug) => ({ slug }));
}

export default async function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = getBySlug<Theme>("marin:StrategicTheme", slug);
  if (!theme) notFound();

  const goals = getParts(theme);
  const owner = getOwner(theme);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={theme} />
      <Breadcrumbs node={theme} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {theme["marin:status"] && <StatusBadge status={theme["marin:status"]} />}
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {theme.name}
      </h1>
      <p className="mt-4 max-w-3xl font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {theme.description}
      </p>
      {owner && (
        <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
          Owned by {owner.name}
        </p>
      )}
      {typeof theme["marin:progress"] === "number" && (
        <div className="mt-6 max-w-sm">
          <ProgressBar value={theme["marin:progress"]} />
        </div>
      )}

      <div className="mt-10">
        <RelatedList heading="Goals" items={goals} />
      </div>
    </article>
  );
}
