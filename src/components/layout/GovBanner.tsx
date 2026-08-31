import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

/**
 * The official-website strip above the header, patterned on USWDS's banner
 * and carried over from Engage Marin. Dark in both themes.
 */
export function GovBanner() {
  return (
    <section
      aria-label="Official government website"
      className="bg-stone-900 text-white dark:bg-black"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-1.5 sm:px-6 lg:px-8">
        {/* next/image rather than a bare <img> so the src picks up basePath
            on subpath deploys (GitHub Pages project sites). With images
            unoptimized this renders as a plain img. */}
        <Image
          src="/gold-seal.svg"
          alt=""
          aria-hidden="true"
          width={217}
          height={211}
          className="h-4 w-auto shrink-0 object-contain sm:h-5"
        />
        {/* The ellipsis lives on the link, not the paragraph: `truncate` on a
            wrapper clips the link's focus ring (a box-shadow drawn outside its
            border box) to nothing (WCAG 2.4.7). An element's own overflow
            never clips its own shadow. */}
        <p className="min-w-0 font-product-body text-xs font-medium leading-none">
          <a
            href={siteConfig.countyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block max-w-full truncate rounded text-white underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marin-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 dark:focus-visible:ring-offset-black"
          >
            An official website of the County of Marin
          </a>
        </p>
      </div>
    </section>
  );
}
