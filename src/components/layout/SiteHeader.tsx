import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

/**
 * Sticky site header: site name on the left, primary nav on the right.
 * Swap the text brand for a logo component when the site has one — keep the
 * link's accessible name and focus treatment.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-stone-800 dark:bg-stone-900/95 dark:supports-[backdrop-filter]:bg-stone-900/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 rounded-md font-product-display text-lg font-semibold text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
          aria-label={`${siteConfig.name} home`}
        >
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 sm:gap-2">
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
