import Link from "next/link";
import { CountyLogo } from "./CountyLogo";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    // Dark surface in every theme. Media-strategy dark mode can't be scoped
    // to a subtree, so colors are hardcoded light-on-dark rather than `dark:`.
    <footer className="border-t border-stone-800 bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <a
              href={siteConfig.countyUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="County of Marin website"
              className="inline-block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
            >
              <CountyLogo className="h-28 text-white sm:h-32" />
            </a>
            <p className="mt-4 font-product-body text-sm text-stone-400">
              A project of the County of Marin
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="mb-3 font-product-display text-sm font-semibold tracking-wide text-stone-300">
              {siteConfig.name}
            </h2>
            <ul className="space-y-2 font-product-body">
              {siteConfig.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded text-sm text-stone-400 transition-colors hover:text-marin-blue-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
