import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siFacebook, siInstagram, siX, siYoutube } from "simple-icons";
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
 * Homepage. Short-term simplified structure: a hero, an empty dark-blue
 * weight band, three cards (Learn More / Get Involved / Impact), the "Make
 * your voice heard" CTA set, and "Stay connected" (communications.json,
 * rendered as plain icon+label tiles). Everything else (goals, timeline,
 * KPIs, etc. from the earlier content-graph build) was removed for the MVP;
 * the site is just the homepage and /about, both driven by plan.json so
 * copy can be updated without touching page code.
 */

// Real brand marks in currentColor (not each platform's own brand color) so
// they stay inside the site's token palette rather than importing five more
// arbitrary hex values — see AGENTS.md § Design tokens. Keyed by the last
// segment of the channel's @id. Anything not in this map (e.g. Engage
// Marin, a Service rather than a social account) falls back to a generic
// icon rather than guessing at a logo that doesn't exist for it.
const SOCIAL_ICON_PATH: Record<string, string> = {
  facebook: siFacebook.path,
  instagram: siInstagram.path,
  x: siX.path,
  youtube: siYoutube.path,
};

function channelSlug(id: string): string {
  return id.split("/").pop() ?? "";
}

function ChannelIcon({ id }: { id: string }) {
  const path = SOCIAL_ICON_PATH[channelSlug(id)];
  if (path) {
    return (
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor" aria-hidden="true">
        <path d={path} />
      </svg>
    );
  }
  return <MessageCircle aria-hidden="true" className="size-7" />;
}

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

        {/* Deliberately empty — just gives the hero some dark-blue visual
            weight underneath it. Was the "Envision Marin so far" stats band
            (see marin:impactStats in schema.ts); no engagement-numbers
            source to drive real stats yet, so there's nothing in it. */}
        <div className="h-12 bg-marin-blue-900 sm:h-16 lg:h-20" />
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
              <h2 className="text-center font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                Stay connected
              </h2>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                {channels.map((channel) => (
                  <a
                    key={channel["@id"]}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-2 rounded-lg p-4 text-center text-stone-700 transition-colors hover:bg-white hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-marin-blue-50 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                  >
                    <ChannelIcon id={channel["@id"]} />
                    <span className="font-product-body text-sm font-medium">{channel.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
