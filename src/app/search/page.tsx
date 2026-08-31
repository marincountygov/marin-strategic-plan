import type { Metadata } from "next";
import { SearchClient } from "@/components/content/SearchClient";

export const metadata: Metadata = { title: "Search" };

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Search
      </h1>
      <p className="mt-2 font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Search across every goal, initiative, report, meeting, update, and KPI on this site.
      </p>
      <div className="mt-8">
        <SearchClient />
      </div>
    </div>
  );
}
