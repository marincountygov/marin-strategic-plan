import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/content/JsonLd";
import { LandscapeIllustration } from "@/components/content/LandscapeIllustration";
import { getAll, getPlan } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import type { EngagementActivitySchema } from "@/lib/content/schema";
import type { z } from "zod";

type EngagementActivity = z.infer<typeof EngagementActivitySchema>;

/**
 * Homepage. Short-term simplified structure: a hero, three cards (Learn
 * More / Get Involved / Impact), a stats strip, and the "Make your voice
 * heard" CTA set (also on /participate — the destination its own actions
 * lead to, but kept here too since it's the homepage's primary ask).
 * Everything else (goals, timeline, KPIs, etc.) lives on its own page,
 * mostly under /plan and /progress now, just not surfaced here. Every
 * section is computed from plan.json rather than hardcoded, so the copy
 * and stats update without touching this file.
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

      {/* Hero, matching Engage Marin's own layout: left-aligned copy in a
          max-w-2xl column, the same layered-landscape SVG anchored to the
          bottom, a stats band immediately below. Engage Marin shared their
          actual page source, so the illustration and this structure are
          taken directly from it rather than approximated — both sites draw
          on the same underlying design system, so the token names line up
          without translation. See LandscapeIllustration.tsx for what's
          deliberately not carried over (their font, their logo, their
          manual theme toggle). */}
      <section className="w-full overflow-hidden">
        <div className="relative bg-marin-gold-50 pt-9 pb-9 dark:bg-marin-blue-950 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-12">
          <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h1 className="text-balance font-product-display text-3xl font-semibold tracking-tight text-marin-blue-950 sm:text-4xl lg:text-5xl dark:text-stone-50">
                {plan.name}
              </h1>
              <p className="mt-5 font-product-body text-base leading-relaxed text-marin-black/80 sm:text-lg dark:text-stone-300">
                {plan.description}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button asChild size="lg" className="rounded-lg">
                  <Link href="/plan">Explore the plan</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-lg">
                  <Link href="/participate">Get involved</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <LandscapeIllustration className="-mt-px block h-24 w-full sm:h-40 lg:h-auto" />

        {/* Stats band — dark in both themes, same reasoning as the footer/gov
            banner: a deliberate fixed surface, not something dark mode
            inverts. dt before dd in the DOM keeps the label read first even
            though flex-col-reverse puts the number on top visually. */}
        <div className="bg-marin-blue-900 px-5 py-7 sm:px-10 sm:py-8 lg:px-14">
          <h2 className="font-product-body text-xs font-semibold tracking-wider text-marin-blue-200 uppercase">
            Envision Marin so far
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse gap-1">
                <dt className="font-product-body text-sm leading-snug text-marin-blue-200">
                  {stat.label}
                </dt>
                <dd className="font-product-display text-3xl font-semibold tracking-tight text-marin-blue-50 sm:text-4xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
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

      <section aria-labelledby="make-your-voice-heard" className="bg-marin-blue-50 dark:bg-stone-900">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
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
        </div>
      </section>
    </>
  );
}
