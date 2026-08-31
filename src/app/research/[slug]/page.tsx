import { notFound } from "next/navigation";
import Link from "next/link";
import { RelatedList } from "@/components/content/RelatedList";
import { JsonLd } from "@/components/content/JsonLd";
import { getBySlug, getRelated, routeSlugsFor } from "@/lib/content/graph";
import type { ResearchItemSchema } from "@/lib/content/schema";
import type { z } from "zod";

type ResearchItem = z.infer<typeof ResearchItemSchema>;

export function generateStaticParams() {
  return routeSlugsFor("Dataset").map((slug) => ({ slug }));
}

export default async function ResearchItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getBySlug<ResearchItem>("Dataset", slug);
  if (!item) notFound();

  const related = getRelated(item);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={item} />
      <p className="font-product-body text-sm font-medium text-marin-blue-700 dark:text-marin-blue-300">
        {item["marin:researchType"]} · {item["marin:year"]}
      </p>
      <h1 className="mt-2 font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        {item.name}
      </h1>
      <p className="mt-4 font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
        {item.description}
      </p>
      {item.url && (
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          View source
        </Link>
      )}

      <div className="mt-10">
        <RelatedList heading="Related goals" items={related} />
      </div>
    </article>
  );
}
