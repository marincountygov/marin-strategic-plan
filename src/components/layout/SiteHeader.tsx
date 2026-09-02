import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Site header: site name on the left, primary nav on the right.
 * Swap the text brand for a logo component when the site has one — keep the
 * link's accessible name and focus treatment.
 */
export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:min-h-16 sm:px-6 lg:px-8">
        <span className="flex min-w-0 shrink items-baseline gap-1">
          <Link
            href="/"
            className="truncate rounded-md font-product-display text-lg font-semibold text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
            aria-label={`${siteConfig.name} home`}
          >
            {siteConfig.name}
          </Link>
          {/* Staging marker — remove when this site is ready to go live. */}
          <sup className="shrink-0 font-product-mono text-xs font-bold tracking-wide text-marin-red-700 dark:text-marin-red-300">
            TEST
          </sup>
        </span>

        <nav aria-label="Primary">
          <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-2 py-1.5 font-product-body text-sm font-medium text-stone-700 hover:bg-marin-blue-50 hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:px-3 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
