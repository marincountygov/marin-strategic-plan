"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BASE_PATH } from "@/lib/base-path";

interface SearchEntry {
  id: string;
  type: string;
  name: string;
  summary: string;
  tags: string[];
  url: string;
}

/** Filters a pre-built JSON index client-side — the org's existing search
 *  pattern (marin-docs/search) for a dataset this small, rather than a
 *  search library or server. */
export function SearchClient() {
  const [entries, setEntries] = useState<SearchEntry[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch(`${BASE_PATH}/data/search-index.json`)
      .then((res) => res.json())
      .then(setEntries)
      .catch(() => setEntries([]));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter(
      (entry) =>
        entry.name.toLowerCase().includes(q) ||
        entry.summary?.toLowerCase().includes(q) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(q)),
    );
  }, [entries, query]);

  return (
    <div>
      <label htmlFor="search-input" className="sr-only">
        Search goals, initiatives, reports, meetings, updates, KPIs, and departments
      </label>
      <Input
        id="search-input"
        type="search"
        placeholder="Search goals, initiatives, reports, meetings, updates…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="max-w-xl"
      />

      <p className="mt-3 font-product-body text-sm text-marin-dark-gray dark:text-stone-400" role="status">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 space-y-4">
        {results.map((entry) => (
          <li key={entry.id} className="rounded-xl bg-card p-4 shadow-xs ring-1 ring-foreground/10">
            <Badge variant="secondary" className="mb-1">
              {entry.type.replace("marin:", "")}
            </Badge>
            <div>
              <Link
                href={entry.url}
                className="rounded font-product-display text-base font-semibold text-stone-900 hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-stone-50 dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
              >
                {entry.name}
              </Link>
            </div>
            <p className="mt-1 font-product-body text-sm text-marin-dark-gray dark:text-stone-300">
              {entry.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
