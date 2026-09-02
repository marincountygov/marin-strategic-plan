import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS } from "./collection-meta";

export const metadata: Metadata = { title: "Admin" };

export default function AdminHomePage() {
  return (
    <div>
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 dark:text-stone-50">
        Content Admin
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Edit any collection using the list on the left. Pick a collection to
        get started, or below.
      </p>
      <div className="mt-4 max-w-2xl rounded-md bg-marin-gold-50 p-4 font-product-body text-sm text-marin-gold-900 dark:bg-marin-gold-950 dark:text-marin-gold-200">
        <strong>This doesn&apos;t save to the site.</strong> This is a
        static export with no server or database — there&apos;s nowhere for
        a browser to write back into the repo. Edits autosave as a local
        draft in this browser only. When you&apos;re done, use{" "}
        <span className="font-product-mono text-xs">Download updated JSON</span>{" "}
        on a collection to export the file, then replace the matching file
        in <span className="font-product-mono text-xs">src/data/</span> and
        commit it, same as any other change to this repo.
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {COLLECTIONS.map((collection) => {
          const Icon = collection.icon;
          return (
            <li key={collection.file}>
              <Link
                href={`/admin/${collection.slug}`}
                className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10 hover:ring-marin-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
              >
                <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-marin-blue-700 dark:text-marin-blue-300" />
                <span>
                  <span className="block font-product-display text-sm font-semibold text-stone-900 dark:text-stone-50">
                    {collection.title}
                  </span>
                  <span className="mt-0.5 block font-product-body text-xs text-marin-dark-gray dark:text-stone-400">
                    {collection.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
