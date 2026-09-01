import type { Metadata } from "next";
import Link from "next/link";
import { getContentByFile, getOwner } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import { JsonValue, humanizeKey } from "@/components/content/JsonValue";
import { StatusBadge } from "@/components/content/StatusBadge";
import { PriorityBadge } from "@/components/content/PriorityBadge";
import { ProgressBar } from "@/components/content/ProgressBar";
import { BASE_PATH } from "@/lib/base-path";
import { SECTION_LABELS } from "./section-labels";

export const metadata: Metadata = { title: "Data Explorer" };

function typeLabel(node: { "@type": string | string[] }): string {
  const types = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  return types.map(humanizeKey).join(", ");
}

/**
 * Every item behind the site, in plain language first: name, description,
 * and status are always visible — no click required — with the exact
 * underlying JSON-LD fields one toggle away in the same card for anyone who
 * wants them. Same page serves both a quick skim and a full technical
 * drill-down; nothing about the data is hidden, just sequenced.
 */
export default function JsonBrowserPage() {
  const files = getContentByFile();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Data Explorer
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Every goal, KPI, milestone, and update behind this site, in one place.
        Each item shows its plain-language summary; open{" "}
        <span className="font-product-mono text-sm">View all fields</span> on
        any item for the exact underlying data.
      </p>
      <p className="mt-2 max-w-2xl font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
        Technical note: this reads directly from the same JSON-LD source
        files (<code className="font-product-mono text-xs">src/data/</code>)
        that render the rest of the site — nothing here is reformatted or
        summarized from something else. A machine-readable export of the
        same data is available as{" "}
        <a
          href={`${BASE_PATH}/data/graph.json`}
          className="rounded text-marin-blue-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          one merged JSON-LD graph
        </a>
        .
      </p>

      <nav aria-label="Jump to section" className="mt-6">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-product-body text-sm">
          {files.map(({ file, nodes }) => (
            <li key={file}>
              <a
                href={`#${file}`}
                className="rounded text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
              >
                {SECTION_LABELS[file].title} ({nodes.length})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        {files.map(({ file, nodes }) => {
          const section = SECTION_LABELS[file];
          return (
            <section key={file} id={file} className="scroll-mt-20">
              <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
                {section.title}
              </h2>
              <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
                {section.description}
              </p>
              <p className="font-product-mono text-xs text-marin-dark-gray dark:text-stone-400">
                {file} · {nodes.length} {nodes.length === 1 ? "item" : "items"}
              </p>

              <div className="mt-4 space-y-3">
                {nodes.map((node) => {
                  const owner = getOwner(node);
                  const status = node["marin:status"];
                  const priority = node["marin:priority"];
                  const progress = node["marin:progress"];

                  return (
                    <div
                      key={node["@id"]}
                      className="rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10"
                    >
                      {/* Plain-language summary — always visible, no click required. */}
                      <div className="flex flex-wrap items-center gap-2">
                        {status && <StatusBadge status={status} />}
                        {priority && <PriorityBadge priority={priority} />}
                        <span className="font-product-mono text-xs text-marin-dark-gray dark:text-stone-400">
                          {typeLabel(node)}
                        </span>
                      </div>
                      <p className="mt-1.5 font-product-display text-base font-semibold text-stone-900 dark:text-stone-50">
                        <Link
                          href={urlForNode(node)}
                          className="rounded hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                        >
                          {node.name}
                        </Link>
                      </p>
                      <p className="mt-1 font-product-body text-sm text-stone-700 dark:text-stone-300">
                        {node.description}
                      </p>
                      {owner && (
                        <p className="mt-1 font-product-body text-xs text-marin-dark-gray dark:text-stone-400">
                          Owned by {owner.name}
                        </p>
                      )}
                      {typeof progress === "number" && (
                        <div className="mt-3 max-w-xs">
                          <ProgressBar value={progress} />
                        </div>
                      )}

                      {/* Deeper data — every field, exactly as stored, one click away. */}
                      <details className="mt-3">
                        <summary className="cursor-pointer rounded font-product-body text-sm text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900">
                          View all fields
                        </summary>
                        <dl className="mt-3 space-y-3 border-t border-stone-200 pt-3 dark:border-stone-800">
                          {Object.entries(node).map(([key, value]) => (
                            <div key={key}>
                              <dt className="font-product-body text-xs font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
                                {humanizeKey(key)}
                              </dt>
                              <dd className="mt-0.5 font-product-body text-sm text-stone-900 dark:text-stone-100">
                                <JsonValue value={value} />
                              </dd>
                            </div>
                          ))}
                        </dl>
                      </details>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
