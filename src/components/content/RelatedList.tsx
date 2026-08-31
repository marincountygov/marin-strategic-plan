import { EntityCard } from "./EntityCard";
import type { BaseEntity } from "@/lib/content/schema";

export function RelatedList({
  heading,
  headingLevel = "h2",
  items,
}: {
  heading: string;
  headingLevel?: "h2" | "h3";
  items: BaseEntity[];
}) {
  if (items.length === 0) return null;
  const Heading = headingLevel;

  return (
    <section aria-labelledby={`related-${heading.toLowerCase().replace(/\s+/g, "-")}`}>
      <Heading
        id={`related-${heading.toLowerCase().replace(/\s+/g, "-")}`}
        className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50"
      >
        {heading}
      </Heading>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <EntityCard key={item["@id"]} node={item} />
        ))}
      </div>
    </section>
  );
}
