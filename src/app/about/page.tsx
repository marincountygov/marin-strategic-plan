import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

/**
 * Example content page: heading hierarchy, readable measure, dark pairing.
 */
export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        About this template
      </h1>
      <div className="mt-6 space-y-4 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
        <p>
          This template packages the design system built for Engage Marin —
          the County of Marin&apos;s civic engagement platform — so new County
          websites start from the same visual standard, accessibility bar, and
          coding conventions instead of rebuilding them.
        </p>
        <p>
          It ships static by default, so a finished site can be hosted on
          GitHub Pages, Vercel, or county infrastructure. The README covers
          setup and deployment; AGENTS.md carries the standards that every
          change is expected to follow.
        </p>
      </div>
    </article>
  );
}
