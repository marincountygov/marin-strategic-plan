import type { Metadata } from "next";
import { Timeline } from "@/components/content/Timeline";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { PhaseSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Phase = z.infer<typeof PhaseSchema>;

export const metadata: Metadata = { title: "Timeline" };

export default function TimelinePage() {
  const phases = getAll<Phase>("marin:PlanPhase");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={phases} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Timeline
      </h1>
      <p className="mt-2 font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        The phases the plan moves through, from initial research to ongoing reporting.
      </p>
      <div className="mt-10">
        <Timeline phases={phases} />
      </div>
    </div>
  );
}
