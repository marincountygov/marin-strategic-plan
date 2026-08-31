import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { GoalSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Goal = z.infer<typeof GoalSchema>;

export const metadata: Metadata = { title: "Goals" };

export default function GoalsPage() {
  const goals = getAll<Goal>("marin:Goal");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={goals} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Goals
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Measurable commitments under each strategic theme, tracked by status, priority, and progress.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <EntityCard key={goal["@id"]} node={goal} />
        ))}
      </div>
    </div>
  );
}
