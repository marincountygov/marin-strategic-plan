import Link from "next/link";
import { getById } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import { BASE_URL } from "@/lib/content/context";
import { humanizeKey } from "@/lib/content/humanize";

export { humanizeKey };

/** Renders any field value from the content graph generically — string,
 *  number, boolean, array, or nested object — so every node type is
 *  browsable on /json without per-type rendering code. An @id reference
 *  resolves to the target node's name as a link; a dangling reference
 *  (shouldn't happen — check:content catches those) falls back to the raw
 *  URL so nothing silently disappears. */
export function JsonValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-marin-dark-gray dark:text-stone-500">—</span>;
  }

  if (typeof value === "string") {
    if (value.startsWith(BASE_URL)) {
      const node = getById(value);
      if (node) {
        return (
          <Link
            href={urlForNode(node)}
            className="rounded font-product-body text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
          >
            {node.name}
          </Link>
        );
      }
      return (
        <span className="font-product-mono text-xs text-marin-red-700 dark:text-marin-red-300">
          {value} (unresolved)
        </span>
      );
    }
    if (/^https?:\/\//.test(value)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded font-product-body break-all text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          {value}
        </a>
      );
    }
    return <span>{value}</span>;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return <span>{String(value)}</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <span className="text-marin-dark-gray dark:text-stone-500">—</span>;
    }
    return (
      <ul className="list-disc space-y-1 pl-5">
        {value.map((item, index) => (
          <li key={index}>
            <JsonValue value={item} />
          </li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <dl className="ml-2 space-y-1 border-l border-stone-200 pl-3 dark:border-stone-700">
        {Object.entries(value as Record<string, unknown>).map(([key, entryValue]) => (
          <div key={key}>
            <dt className="font-product-body text-xs font-semibold text-marin-dark-gray dark:text-stone-400">
              {humanizeKey(key)}
            </dt>
            <dd className="font-product-body text-sm text-stone-900 dark:text-stone-100">
              <JsonValue value={entryValue} />
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return null;
}
