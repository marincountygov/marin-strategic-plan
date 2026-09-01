import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAll, getPlan } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import type { EngagementActivitySchema, CommunicationChannelSchema } from "@/lib/content/schema";
import type { z } from "zod";

type EngagementActivity = z.infer<typeof EngagementActivitySchema>;
type CommunicationChannel = z.infer<typeof CommunicationChannelSchema>;

export const metadata: Metadata = { title: "Participate" };

const SECTIONS = [
  {
    title: "Engagement Activities",
    description: "Upcoming and past workshops, meetings, and open houses.",
    href: "/engagement",
  },
  {
    title: "Who's Involved",
    description: "The departments, agencies, and residents involved — and how decisions get made.",
    href: "/who-is-involved",
  },
];

export default function ParticipateHubPage() {
  const plan = getPlan();
  const events = getAll<EngagementActivity>("Event");
  const voiceActions = plan["marin:voiceActions"] ?? [];
  const engageMarin = getAll<CommunicationChannel>("Service").find(
    (channel) => channel.name === "Engage Marin",
  );

  const nextEvent = events
    .filter((event) => event["marin:status"] === "Planning" || event["marin:status"] === "Not Started")
    .sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime())[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Participate
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Share your ideas and priorities with the County — online through{" "}
        {engageMarin ? (
          <a
            href={engageMarin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded text-marin-blue-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
          >
            Engage Marin
          </a>
        ) : (
          "Engage Marin"
        )}
        , or in person at an upcoming workshop or open house near you.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <Card key={section.href}>
            <CardHeader>
              <CardTitle className="font-product-display text-lg">
                <Link
                  href={section.href}
                  className="rounded hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  {section.title}
                </Link>
              </CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <section aria-labelledby="make-your-voice-heard" className="mt-14">
        <h2
          id="make-your-voice-heard"
          className="text-center font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50"
        >
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
      </section>
    </div>
  );
}
