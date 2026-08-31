import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EntityCard } from "@/components/content/EntityCard";
import { ProgressBar } from "@/components/content/ProgressBar";
import { StatusBadge } from "@/components/content/StatusBadge";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll, getById, getPlan } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import type {
  GoalSchema,
  MilestoneSchema,
  PhaseSchema,
  UpdateSchema,
  EngagementActivitySchema,
} from "@/lib/content/schema";
import type { z } from "zod";

type Goal = z.infer<typeof GoalSchema>;
type Milestone = z.infer<typeof MilestoneSchema>;
type Phase = z.infer<typeof PhaseSchema>;
type Update = z.infer<typeof UpdateSchema>;
type EngagementActivity = z.infer<typeof EngagementActivitySchema>;

/**
 * Homepage. Every section below is computed from the content graph — no
 * hardcoded copy — so it stays current as src/data/*.json changes.
 */
export default function Home() {
  const plan = getPlan();
  const goals = getAll<Goal>("marin:Goal");
  const phases = getAll<Phase>("marin:PlanPhase").sort((a, b) => a.order - b.order);
  const milestones = getAll<Milestone>("marin:Milestone");
  const updates = [...getAll<Update>("BlogPosting"), ...getAll<Update>("NewsArticle")];
  const events = getAll<EngagementActivity>("Event");

  const currentPhase = phases.find((phase) => phase["marin:status"] === "In Progress");
  const latestUpdate = [...updates].sort(
    (a, b) => new Date(b.datePublished).getTime() - new Date(a.datePublished).getTime(),
  )[0];
  const nextMilestone = milestones
    .filter((m) => m["marin:status"] !== "Completed" && m["marin:status"] !== "Cancelled")
    .sort((a, b) => new Date(a["marin:dueDate"]).getTime() - new Date(b["marin:dueDate"]).getTime())[0];
  const featuredGoals = (plan["marin:featuredGoals"] ?? [])
    .map((goalId) => getById<Goal>(goalId))
    .filter((goal): goal is Goal => Boolean(goal));
  const upcomingEvents = events
    .filter((event) => event["marin:status"] === "Planning" || event["marin:status"] === "Not Started")
    .sort((a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime());
  const overallProgress = Math.round(
    goals.reduce((sum, goal) => sum + (goal["marin:progress"] ?? 0), 0) / (goals.length || 1),
  );

  return (
    <>
      <JsonLd data={plan} />

      <section className="bg-marin-blue-500 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h1 className="max-w-2xl font-product-display text-4xl font-semibold sm:text-5xl">
            {plan.name}
          </h1>
          <p className="mt-4 max-w-xl font-product-body text-lg text-white">{plan.description}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-marin-blue-700 hover:bg-marin-blue-50 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marin-blue-500"
            >
              <Link href="/goals">Explore the goals</Link>
            </Button>
            {/* A fully opaque light fill rather than a translucent tint over
                the blue hero: dark text on solid marin-blue-50 clears AA
                with a wide margin regardless of what's behind it. Every
                conditional slot the outline variant defines (hover, aria-
                expanded, dark:) is overridden as a matched bg+text pair —
                leaving just one half inherited (e.g. a hover background
                override with no matching hover text override) lets axe
                catch the mismatched combination as a reachable low-contrast
                state even though this link never sets aria-expanded. */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-marin-blue-50 text-marin-blue-800 hover:bg-white hover:text-marin-blue-800 aria-expanded:bg-white aria-expanded:text-marin-blue-800 dark:border-white dark:bg-marin-blue-50 dark:text-marin-blue-800 dark:hover:bg-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-marin-blue-500"
            >
              <Link href="/engagement">Get involved</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
            <h2 className="font-product-display text-sm font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
              Current phase
            </h2>
            {currentPhase ? (
              <>
                <p className="mt-2 font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                  {currentPhase.name}
                </p>
                <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                  {currentPhase.description}
                </p>
                <div className="mt-3">
                  <ProgressBar value={currentPhase["marin:percentComplete"]} />
                </div>
              </>
            ) : (
              <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                No phase currently in progress.
              </p>
            )}
            <Link
              href="/timeline"
              className="mt-4 inline-block rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
            >
              View full timeline
            </Link>
          </div>

          <div className="rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
            <h2 className="font-product-display text-sm font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
              Next milestone
            </h2>
            {nextMilestone ? (
              <>
                <p className="mt-2 font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                  {nextMilestone.name}
                </p>
                <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                  Due {nextMilestone["marin:dueDate"]}
                </p>
                <div className="mt-3">
                  <StatusBadge status={nextMilestone["marin:status"] ?? "Not Started"} />
                </div>
              </>
            ) : (
              <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                No upcoming milestones.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
            <h2 className="font-product-display text-sm font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
              Latest update
            </h2>
            {latestUpdate ? (
              <>
                <p className="mt-2 font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                  {latestUpdate.name}
                </p>
                <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                  {latestUpdate.description}
                </p>
                <Link
                  href={urlForNode(latestUpdate)}
                  className="mt-3 inline-block rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  Read more
                </Link>
              </>
            ) : (
              <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
                No updates yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Featured goals
          </h2>
          <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
            Overall progress: {overallProgress}%
          </p>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {featuredGoals.map((goal) => (
            <EntityCard key={goal["@id"]} node={goal} />
          ))}
        </div>
        <Link
          href="/goals"
          className="mt-6 inline-block rounded font-product-body text-sm font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          View all goals
        </Link>
      </section>

      {upcomingEvents.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          <h2 className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50">
            Current participation opportunities
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EntityCard key={event["@id"]} node={event} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
