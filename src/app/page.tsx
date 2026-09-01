import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll, getPlan } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import type { EngagementActivitySchema } from "@/lib/content/schema";
import type { z } from "zod";

type EngagementActivity = z.infer<typeof EngagementActivitySchema>;

/**
 * Homepage. Short-term simplified structure per stakeholder feedback: a
 * one-line hero, three cards (Learn More / Get Involved / Impact), and a
 * single "Make your voice heard" call-to-action section — everything else
 * (goals, timeline, KPIs, etc.) still lives on its own page, just not
 * surfaced here for now. Every section is computed from plan.json rather
 * than hardcoded, so the copy and stats update without touching this file.
 */
export default function Home() {
  const plan = getPlan();
  const events = getAll<EngagementActivity>("Event");

  const homeCards = plan["marin:homeCards"] ?? [];
  const voiceActions = plan["marin:voiceActions"] ?? [];

  // "Community events held" is derived from our own data rather than
  // duplicated as a manually-maintained stat; "Constituents engaged" has no
  // equivalent source here yet (it comes from Engage's own reporting), so it
  // stays as the one manually-entered figure in marin:impactStats.
  const completedEventsCount = events.filter(
    (event) => event["marin:status"] === "Completed",
  ).length;
  const impactStats = [
    ...(plan["marin:impactStats"] ?? []),
    { label: "Community events held", value: String(completedEventsCount) },
  ];

  const nextEvent = events
    .filter((event) => event["marin:status"] === "Planning" || event["marin:status"] === "Not Started")
    .sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime())[0];

  return (
    <>
      <JsonLd data={plan} />

      <section className="bg-marin-blue-500 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-product-display text-4xl font-semibold sm:text-5xl">{plan.name}</h1>
          <p className="mx-auto mt-4 max-w-2xl font-product-body text-lg text-white">
            {plan.description}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {homeCards.map((card) => (
            <Card key={card.heading} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-product-display text-xl">{card.heading}</CardTitle>
                <CardDescription>{card.body}</CardDescription>
              </CardHeader>
              {card.heading === "Impact" && (
                <CardContent>
                  <dl className="flex gap-6">
                    {impactStats.map((stat) => (
                      <div key={stat.label}>
                        <dt className="font-product-body text-xs text-marin-dark-gray dark:text-stone-400">
                          {stat.label}
                        </dt>
                        <dd className="font-product-display text-2xl font-semibold text-marin-blue-700 dark:text-marin-blue-300">
                          {stat.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </CardContent>
              )}
              <CardContent className="mt-auto">
                <Link
                  href={card.linkHref}
                  className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  {card.linkLabel} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-marin-blue-50 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <h2 className="text-center font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
            Make your voice heard
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {voiceActions.map((action) => {
              const href =
                action.id === "attend-event"
                  ? nextEvent
                    ? urlForNode(nextEvent)
                    : "/engagement"
                  : (action.url ?? "/engagement");
              const external = href.startsWith("http");

              return (
                <Card key={action.id}>
                  <CardHeader>
                    <p className="font-product-mono text-xs font-semibold tracking-wide text-marin-blue-700 uppercase dark:text-marin-blue-300">
                      {action.timeCommitment}
                    </p>
                    <CardTitle className="font-product-display text-lg">{action.label}</CardTitle>
                    <CardDescription>
                      {action.id === "attend-event" && nextEvent
                        ? `${action.description} Next up: ${nextEvent.name}.`
                        : action.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                    >
                      {action.id === "attend-event" ? "RSVP" : "Get started"} →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
