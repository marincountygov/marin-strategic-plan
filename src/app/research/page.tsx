import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { ResearchItemSchema } from "@/lib/content/schema";
import type { z } from "zod";

type ResearchItem = z.infer<typeof ResearchItemSchema>;

export const metadata: Metadata = { title: "Research" };

export default function ResearchPage() {
  const items = getAll<ResearchItem>("Dataset");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={items} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Research
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Existing plans, surveys, demographic studies, and data sources the plan&apos;s goals are built on.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EntityCard key={item["@id"]} node={item} />
        ))}
      </div>
    </div>
  );
}
