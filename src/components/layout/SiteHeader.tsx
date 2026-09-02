import Link from "next/link";
import { Shield } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/**
 * Sticky site header: site name on the left, primary nav on the right.
 * Swap the text brand for a logo component when the site has one — keep the
 * link's accessible name and focus treatment.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-stone-800 dark:bg-stone-900/95 dark:supports-[backdrop-filter]:bg-stone-900/80">
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

        {/* flex-wrap: this site's nav (src/lib/content/sections.ts) has more
            top-level items than the template's 3-item demo nav assumed —
            without wrapping, items overflow the header's fixed-height box
            and their pixels land outside its painted background, which is
            invisible in light mode (body's surface-alt token is near-white
            already) but exposes the unpaired body background in dark mode. */}
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

        {/* A pill, not a 4th item in the nav above — matches Engage Marin's
            own header pattern (their real markup has exactly this: a
            bordered Shield-icon pill labeled "Admin"), and keeps the
            3-item primary nav from the earlier redesign untouched. Their
            corner radius is a one-off 10px value; the "lg" radius token is
            the nearest fit, per AGENTS.md's no-arbitrary-values rule. */}
        <Link
          href="/admin"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-marin-blue-200 bg-marin-blue-50 px-2.5 py-1.5 font-product-body text-xs font-medium text-marin-blue-700 transition-colors hover:bg-marin-blue-100 hover:text-marin-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:text-sm dark:border-marin-blue-800 dark:bg-marin-blue-950 dark:text-marin-blue-300 dark:hover:bg-marin-blue-900 dark:hover:text-marin-blue-100 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          <Shield aria-hidden="true" className="size-3.5 sm:size-4" />
          Admin
        </Link>
      </div>
    </header>
  );
}
