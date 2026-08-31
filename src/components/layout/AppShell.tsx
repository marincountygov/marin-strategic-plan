import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { GovBanner } from "./GovBanner";
import { SiteHeader } from "./SiteHeader";

/**
 * Top-level page wrapper: skip link, gov banner, header, main, footer.
 * Rendered once in src/app/layout.tsx; pages provide only main content.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white font-product-body text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      {/* A landmark wrapper keeps the skip link out of the "stray text
          outside any region" bucket that page scanners report. Keep it first
          in the DOM. */}
      <nav aria-label="Skip links">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-marin-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
        >
          Skip to main content
        </a>
      </nav>

      <GovBanner />
      <SiteHeader />

      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>

      <Footer />
    </div>
  );
}
