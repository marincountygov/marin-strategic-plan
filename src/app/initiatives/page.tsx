import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { InitiativeSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Initiative = z.infer<typeof InitiativeSchema>;

export const metadata: Metadata = { title: "Initiatives" };

export default function InitiativesPage() {
  const initiatives = getAll<Initiative>("marin:Initiative");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={initiatives} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Initiatives
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        The work underway to implement each strategy, with its risks, dependencies, and progress.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((initiative) => (
          <EntityCard key={initiative["@id"]} node={initiative} />
        ))}
      </div>
    </div>
  );
}
