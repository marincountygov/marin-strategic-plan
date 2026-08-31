import { StatusBadge } from "./StatusBadge";
import { ProgressBar } from "./ProgressBar";
import type { BaseEntity, Status } from "@/lib/content/schema";

interface Phase extends BaseEntity {
  order: number;
  "marin:percentComplete": number;
}

export function Timeline({ phases }: { phases: Phase[] }) {
  const ordered = [...phases].sort((a, b) => a.order - b.order);

  return (
    <ol className="space-y-6 border-l-2 border-marin-blue-200 pl-6 dark:border-marin-blue-900">
      {ordered.map((phase) => (
        <li key={phase["@id"]} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[calc(1.5rem+5px)] top-1 size-2.5 rounded-full bg-marin-blue-500 dark:bg-marin-blue-400"
          />
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-product-display text-lg font-semibold text-stone-900 dark:text-stone-50">
              {phase.name}
            </h3>
            <StatusBadge status={phase["marin:status"] as Status} />
          </div>
          <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
            {phase.description}
          </p>
          <div className="mt-2 max-w-sm">
            <ProgressBar value={phase["marin:percentComplete"]} label="Percent complete" />
          </div>
        </li>
      ))}
    </ol>
  );
}
