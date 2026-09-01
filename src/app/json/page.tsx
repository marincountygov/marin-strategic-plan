import type { Metadata } from "next";
import { getContentByFile } from "@/lib/content/graph";
import { JsonValue, humanizeKey } from "@/components/content/JsonValue";
import { BASE_PATH } from "@/lib/base-path";

export const metadata: Metadata = { title: "Content Data" };

/**
 * Field-by-field browser over every src/data/*.json file — lets anyone see
 * exactly what data drives the site, without reading raw JSON. One section
 * per source file, one collapsible entry per node, every field rendered
 * generically (JsonValue) so this needs no per-type code and stays correct
 * as fields are added.
 */
export default function JsonBrowserPage() {
  const files = getContentByFile();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Content Data
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Every field behind this site, straight from the source JSON-LD files
        in <code className="font-product-mono text-sm">src/data/</code> — no
        page on the site hides or reformats this data, it&apos;s just easier
        to scan here than as raw JSON. For machine consumption, the same data
        is available as{" "}
        {/* underline by default, not just on hover: this link sits inline in
            a paragraph, and its color contrast against the surrounding text
            (1.49:1) is well under the 3:1 that WCAG 1.4.1 requires when
            color is the only distinguishing cue. */}
        <a
          href={`${BASE_PATH}/data/graph.json`}
          className="rounded text-marin-blue-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          one merged JSON-LD graph
        </a>
        .
      </p>

      <nav aria-label="Jump to file" className="mt-6">
        <ul className="flex flex-wrap gap-x-4 gap-y-1 font-product-body text-sm">
          {files.map(({ file, nodes }) => (
            <li key={file}>
              <a
                href={`#${file}`}
                className="rounded text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
              >
                {file} ({nodes.length})
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-12">
        {files.map(({ file, nodes }) => (
          <section key={file} id={file} className="scroll-mt-20">
            <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
              {file}
            </h2>
            <p className="font-product-body text-sm text-marin-dark-gray dark:text-stone-400">
              {nodes.length} {nodes.length === 1 ? "node" : "nodes"}
            </p>

            <div className="mt-4 space-y-3">
              {nodes.map((node) => (
                <details
                  key={node["@id"]}
                  className="rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10"
                >
                  <summary className="cursor-pointer rounded font-product-display text-base font-semibold text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-stone-50 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900">
                    {node.name}{" "}
                    <span className="font-product-mono text-xs font-normal text-marin-dark-gray dark:text-stone-400">
                      {Array.isArray(node["@type"]) ? node["@type"].join(", ") : node["@type"]}
                    </span>
                  </summary>
                  <dl className="mt-4 space-y-3 border-t border-stone-200 pt-4 dark:border-stone-800">
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
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
