import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { RelatedList } from "@/components/content/RelatedList";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getRelated, getAll } from "@/lib/content/graph";
import type { UpdateSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Update = z.infer<typeof UpdateSchema>;

export function generateStaticParams() {
  const slugs = [...getAll<Update>("BlogPosting"), ...getAll<Update>("NewsArticle")].map(
    (update) => update["@id"].split("/").pop() as string,
  );
  return slugs.map((slug) => ({ slug }));
}

function findUpdate(slug: string): Update | undefined {
  return getBySlug<Update>("BlogPosting", slug) ?? getBySlug<Update>("NewsArticle", slug);
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const update = findUpdate(slug);
  if (!update) notFound();

  const related = getRelated(update);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={update} />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{update["marin:category"]}</Badge>
        <time dateTime={update.datePublished} className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
          {update.datePublished}
        </time>
      </div>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {update.name}
      </h1>
      <p className="mt-4 font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {update.description}
      </p>

      <div className="mt-10">
        <RelatedList heading="Related" items={related} />
      </div>
    </article>
  );
}
