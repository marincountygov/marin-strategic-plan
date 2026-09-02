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
import type { CommunicationChannel } from "@/lib/content/schema";

/**
 * Homepage. Short-term simplified structure: a hero, three cards (Learn
 * More / Get Involved / Impact), and the "Make your voice heard" CTA set
 * followed by the communications channels from communications.json. The
 * "Envision Marin so far" stats band is commented out below until there's a
 * real engagement-numbers source to drive it — see marin:impactStats in
 * schema.ts. Everything else (goals, timeline, KPIs, etc. from the earlier
 * content-graph build) was removed for the MVP; the site is just the
 * homepage and /about, both driven by plan.json so copy can be updated
 * without touching page code.
 */
export default function Home() {
  const plan = getPlan();
  const channels = getAll<CommunicationChannel>("Service").concat(
    getAll<CommunicationChannel>("WebSite"),
    getAll<CommunicationChannel>("ContactPoint"),
  );

  const homeCards = plan["marin:homeCards"] ?? [];
  const voiceActions = plan["marin:voiceActions"] ?? [];

  return (
    <>
      <JsonLd data={plan} />

      {/* Hero, matching Engage Marin's own layout: left-aligned copy in a
          max-w-2xl column, the same layered-landscape SVG anchored to the
          bottom. Engage Marin shared their actual page source, so the
          illustration and this structure are taken directly from it rather
          than approximated — both sites draw on the same underlying design
          system, so the token names line up without translation. See
          LandscapeIllustration.tsx for what's deliberately not carried over
          (their font, their logo, their manual theme toggle). */}
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
                  <Link href="/about">About</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <LandscapeIllustration className="-mt-px block h-24 w-full sm:h-40 lg:h-auto" />

        {/* "Envision Marin so far" stats band — commented out until real
            engagement numbers are wired up (see marin:impactStats in
            schema.ts and the note above).
        <div className="bg-marin-blue-900 px-5 py-7 sm:px-10 sm:py-8 lg:px-14">
          <h2 className="font-product-body text-xs font-semibold tracking-wider text-marin-blue-200 uppercase">
            Envision Marin so far
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4">
            {(plan["marin:impactStats"] ?? []).map((stat) => (
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
        */}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {homeCards.map((card) => {
            const external = card.linkHref.startsWith("http");
            return (
              <Card key={card.heading} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-product-display text-xl">{card.heading}</CardTitle>
                  <CardDescription>{card.body}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link
                    href={card.linkHref}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                  >
                    {card.linkLabel} →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
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
              const href = action.url ?? "https://engage.marincounty.gov";
              const external = href.startsWith("http");

              return (
                <Card key={action.id}>
                  <CardHeader>
                    <p className="font-product-mono text-xs font-semibold tracking-wide text-marin-blue-700 uppercase dark:text-marin-blue-300">
                      {action.timeCommitment}
                    </p>
                    <CardTitle className="font-product-display text-lg">{action.label}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                    >
                      Get started →
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {channels.length > 0 && (
            <div className="mt-12">
              <h3 className="text-center font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                Stay connected
              </h3>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {channels.map((channel) => (
                  <Card key={channel["@id"]}>
                    <CardHeader>
                      <CardTitle className="font-product-display text-base">{channel.name}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <a
                        href={channel.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                      >
                        Visit →
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
