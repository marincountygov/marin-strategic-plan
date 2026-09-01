import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAll } from "@/lib/content/graph";
import type { GoalSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Goal = z.infer<typeof GoalSchema>;

export const metadata: Metadata = { title: "Progress" };

const SECTIONS = [
  {
    title: "Timeline",
    description: "The phases the plan moves through, from research to ongoing reporting.",
    href: "/timeline",
  },
  {
    title: "Performance",
    description: "Key performance indicators tracked against baseline and target.",
    href: "/performance",
  },
  {
    title: "Dashboard",
    description: "A live status overview across every goal, theme, and KPI.",
    href: "/dashboard",
  },
  {
    title: "News & Updates",
    description: "Announcements, progress updates, and Board actions.",
    href: "/updates",
  },
  {
    title: "Reports",
    description: "Quarterly and annual progress reports.",
    href: "/reports",
  },
];

export default function ProgressHubPage() {
  const goals = getAll<Goal>("marin:Goal");
  const overallProgress = Math.round(
    goals.reduce((sum, goal) => sum + (goal["marin:progress"] ?? 0), 0) / (goals.length || 1),
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Progress
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        How the plan is moving — {overallProgress}% average progress across all goals right now.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
}
