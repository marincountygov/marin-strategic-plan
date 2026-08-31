import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { UpdateSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Update = z.infer<typeof UpdateSchema>;

export const metadata: Metadata = { title: "News and Updates" };

export default function UpdatesPage() {
  const updates = [...getAll<Update>("BlogPosting"), ...getAll<Update>("NewsArticle")].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={updates} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        News and Updates
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        News, progress updates, Board actions, milestone completions, and upcoming events, newest first.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {updates.map((update) => (
          <EntityCard key={update["@id"]} node={update} />
        ))}
      </div>
    </div>
  );
}
