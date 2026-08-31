import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/content/JsonLd";
import { getAll } from "@/lib/content/graph";
import type { ResourceSchema } from "@/lib/content/schema";
import type { z } from "zod";

type Resource = z.infer<typeof ResourceSchema>;

export const metadata: Metadata = { title: "Resources" };

export default function ResourcesPage() {
  const resources = getAll<Resource>("CreativeWork");

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={resources} />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Resources
      </h1>
      <p className="mt-2 max-w-2xl font-product-body text-base text-marin-dark-gray dark:text-stone-300">
        Downloads, board presentations, FAQs, and related plans.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {resources.map((resource) => (
          <Card key={resource["@id"]} id={resource["@id"].split("/").pop()} className="scroll-mt-20">
            <CardHeader>
              <Badge variant="secondary" className="w-fit">
                {resource["marin:resourceType"]}
              </Badge>
              <CardTitle className="mt-1">
                <Link
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
                >
                  {resource.name}
                </Link>
              </CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
