import type { Metadata } from "next";
import Link from "next/link";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { EngagementActivitySchema, CommunicationChannelSchema } from "@/lib/content/schema";
import type { z } from "zod";

type EngagementActivity = z.infer<typeof EngagementActivitySchema>;
type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;

export const metadata: Metadata = { title: "Engagement" };

export default function EngagementPage() {
  const activities = getAll<EngagementActivity>("Event");
  const channels = getAll<CommunicationChannel>("Service").concat(
    getAll<CommunicationChannel>("WebSite"),
    getAll<CommunicationChannel>("ContactPoint"),
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={[...activities, ...channels]} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Engagement
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Surveys, workshops, and meetings where residents and partners shape the plan.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="grid gap-6 sm:grid-cols-2">
          {activities.map((activity) => (
            <EntityCard key={activity["@id"]} node={activity} />
          ))}
        </div>

        <aside aria-labelledby="stay-connected" className="rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
          <h2 id="stay-connected" className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
            Stay connected
          </h2>
          <ul className="mt-4 space-y-3">
            {channels.map((channel) => (
              <li key={channel["@id"]} id={channel["@id"].split("/").pop()} className="scroll-mt-20">
                <Link
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  {channel.name}
                </Link>
                <p className="font-product-body text-xs text-marin-dark-gray dark:text-stone-400">
                  {channel["marin:purpose"].join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
