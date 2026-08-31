import type { Metadata } from "next";
import { EntityCard } from "@/components/content/EntityCard";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { ThemeSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Theme = z.infer<typeof ThemeSchema>;

export const metadata: Metadata = { title: "Strategic Themes" };

export default function ThemesPage() {
  const themes = getAll<Theme>("marin:StrategicTheme");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={themes} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Strategic Themes
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        The plan&apos;s priorities are organized into a small set of themes. Each theme&apos;s goals, initiatives, and progress are structured data, not narrative.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => (
          <EntityCard key={theme["@id"]} node={theme} />
        ))}
      </div>
    </div>
  );
}
