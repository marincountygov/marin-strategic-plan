import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Circle, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HorizontalBarChart, type BarChartRow } from "@/components/content/HorizontalBarChart";
import { StatusBadge } from "@/components/content/StatusBadge";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll, getPlan } from "@/lib/content/graph";
import { percentToTarget } from "@/lib/content/kpi-math";
import {
  STATUS_BUCKET,
  STATUS_BUCKET_META,
  type StatusBucket,
} from "@/lib/content/status-chart-colors";
import type {
  GoalSchema,
  KpiSchema,
  MilestoneSchema,
  ThemeSchema,
} from "@/lib/content/schema";
import type { EngagementActivitySchema, Status } from "@/lib/content/schema";
import type { z } from "zod";

type Goal = z.infer<typeof GoalSchema>;
type Theme = z.infer<typeof ThemeSchema>;
type Kpi = z.infer<typeof KpiSchema>;
type Milestone = z.infer<typeof MilestoneSchema>;
type EngagementActivity = z.infer<typeof EngagementActivitySchema>;

export const metadata: Metadata = { title: "Dashboard" };

const BUCKET_ICON: Record<StatusBucket, typeof Circle> = {
  neutral: Circle,
  active: Clock,
  good: CheckCircle2,
  attention: AlertTriangle,
};

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10">
      <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">{label}</p>
      <p className="mt-1 font-product-body text-3xl font-semibold text-stone-900 dark:text-stone-50">
        {value}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const plan = getPlan();
  const goals = getAll<Goal>("marin:Goal");
  const themes = getAll<Theme>("marin:StrategicTheme");
  const kpis = getAll<Kpi>("marin:KPI");
  const milestones = getAll<Milestone>("marin:Milestone");
  const events = getAll<EngagementActivity>("Event");

  const overallProgress = Math.round(
    goals.reduce((sum, goal) => sum + (goal["marin:progress"] ?? 0), 0) / (goals.length || 1),
  );
  const completedMilestones = milestones.filter((m) => m["marin:status"] === "Completed").length;
  const completedEvents = events.filter((e) => e["marin:status"] === "Completed").length;
  const upcomingMilestones = milestones
    .filter((m) => m["marin:status"] !== "Completed" && m["marin:status"] !== "Cancelled")
    .sort(
      (a, b) => new Date(a["marin:dueDate"]).getTime() - new Date(b["marin:dueDate"]).getTime(),
    );

  const goalsByStatus = new Map<Status, number>();
  for (const goal of goals) {
    const status = goal["marin:status"];
    if (status) goalsByStatus.set(status, (goalsByStatus.get(status) ?? 0) + 1);
  }
  const statusRows: BarChartRow[] = Array.from(goalsByStatus.entries()).map(([status, count]) => {
    const Icon = BUCKET_ICON[STATUS_BUCKET[status]];
    return {
      key: status,
      label: (
        <span className="flex items-center gap-1.5">
          <Icon aria-hidden="true" className="size-4 shrink-0" />
          {status}
        </span>
      ),
      percent: (count / (goals.length || 1)) * 100,
      displayValue: String(count),
      barClassName: STATUS_BUCKET_META[STATUS_BUCKET[status]].barClass,
    };
  });

  const themeRows: BarChartRow[] = themes.map((theme) => ({
    key: theme["@id"],
    label: theme.name,
    percent: theme["marin:progress"] ?? 0,
    displayValue: `${theme["marin:progress"] ?? 0}%`,
    barClassName: "bg-marin-blue-500 dark:bg-marin-blue-400",
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={[...goals, ...themes, ...kpis]} />

      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Plan Dashboard
      </h1>
      <p className="mt-2 font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        A snapshot of progress across every goal, theme, and KPI, computed live from{" "}
        <Link
          href="/json"
          className="rounded text-marin-blue-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          the same content graph
        </Link>{" "}
        that renders the rest of the site. Last updated {plan.dateModified}.
      </p>

      {/* Hero figure — the one number this view leads with. */}
      <div className="mt-8 rounded-xl bg-card p-6 shadow-xs ring-1 ring-foreground/10">
        <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
          Overall progress across all goals
        </p>
        <p className="mt-1 font-product-body text-6xl font-bold text-marin-blue-700 dark:text-marin-blue-300">
          {overallProgress}%
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Goals" value={String(goals.length)} />
        <StatTile label="Strategic themes" value={String(themes.length)} />
        <StatTile label="KPIs tracked" value={String(kpis.length)} />
        <StatTile
          label="Milestones completed"
          value={`${completedMilestones}/${milestones.length}`}
        />
        <StatTile label="Community events held" value={String(completedEvents)} />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="goals-by-status">
          <h2
            id="goals-by-status"
            className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50"
          >
            Goals by status
          </h2>
          <div className="mt-4">
            <HorizontalBarChart rows={statusRows} />
          </div>
        </section>

        <section aria-labelledby="progress-by-theme">
          <h2
            id="progress-by-theme"
            className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50"
          >
            Progress by theme
          </h2>
          <div className="mt-4">
            <HorizontalBarChart rows={themeRows} />
          </div>
        </section>
      </div>

      <section aria-labelledby="kpi-summary" className="mt-12">
        <div className="flex items-center justify-between">
          <h2
            id="kpi-summary"
            className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50"
          >
            KPI summary
          </h2>
          <Link
            href="/performance"
            className="font-product-body text-sm text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
          >
            Full performance dashboard →
          </Link>
        </div>
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>KPI</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Progress to target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {kpis.map((kpi) => (
              <TableRow key={kpi["@id"]}>
                <TableCell className="font-medium">{kpi.name}</TableCell>
                <TableCell>
                  {kpi["marin:status"] && <StatusBadge status={kpi["marin:status"]} />}
                </TableCell>
                <TableCell>
                  {kpi["marin:currentValue"]} {kpi["marin:unit"]}
                </TableCell>
                <TableCell>
                  {kpi["marin:target"]} {kpi["marin:unit"]}
                </TableCell>
                <TableCell>{percentToTarget(kpi)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section aria-labelledby="upcoming-milestones" className="mt-12">
        <h2
          id="upcoming-milestones"
          className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50"
        >
          Upcoming milestones
        </h2>
        {upcomingMilestones.length > 0 ? (
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Milestone</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingMilestones.map((milestone) => (
                <TableRow key={milestone["@id"]}>
                  <TableCell className="font-medium">{milestone.name}</TableCell>
                  <TableCell>{milestone["marin:dueDate"]}</TableCell>
                  <TableCell>
                    {milestone["marin:status"] && (
                      <StatusBadge status={milestone["marin:status"]} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="mt-2 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
            No upcoming milestones.
          </p>
        )}
      </section>
    </div>
  );
}
