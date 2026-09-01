import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlan } from "@/lib/content/graph";

export const metadata: Metadata = { title: "The Plan" };

const SECTIONS = [
  {
    title: "Vision & Values",
    description: "The vision, mission, and values behind the plan.",
    href: "/vision",
  },
  {
    title: "Strategic Themes",
    description: "The high-level priorities the plan is organized around.",
    href: "/themes",
  },
  {
    title: "Goals",
    description: "What the plan is trying to achieve under each theme.",
    href: "/goals",
  },
  {
    title: "About & FAQ",
    description: "Purpose, scope, planning approach, and answers to common questions.",
    href: "/about",
  },
  {
    title: "Research",
    description: "The studies, surveys, and existing plans this work is built on.",
    href: "/research",
  },
  {
    title: "Resources",
    description: "Downloads, board presentations, and related materials.",
    href: "/resources",
  },
];

export default function PlanHubPage() {
  const plan = getPlan();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        The Plan
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        {plan.description}
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
