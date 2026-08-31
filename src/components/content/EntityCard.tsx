import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { ProgressBar } from "./ProgressBar";
import { urlForNode } from "@/lib/content/routes";
import { slugFromId } from "@/lib/content/context";
import type { BaseEntity } from "@/lib/content/schema";

/** Generic card for any content-graph node — every index and related-content
 *  list renders through this rather than per-entity markup. The `id`
 *  attribute matches the node's slug so anchor links from urlForNode()
 *  resolve to this card when it's embedded on a parent's page. */
export function EntityCard({ node }: { node: BaseEntity }) {
  const href = urlForNode(node);
  const status = node["marin:status"];
  const priority = node["marin:priority"];
  const progress = node["marin:progress"];

  return (
    <Card id={slugFromId(node["@id"])} className="scroll-mt-20">
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          {status && <StatusBadge status={status} />}
          {priority && <PriorityBadge priority={priority} />}
        </div>
        <CardTitle className="mt-1">
          <Link
            href={href}
            className="rounded font-product-display text-base font-semibold text-stone-900 hover:text-marin-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-stone-50 dark:hover:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
          >
            {node.name}
          </Link>
        </CardTitle>
        <CardDescription>{node.description}</CardDescription>
      </CardHeader>
      {typeof progress === "number" && (
        <CardContent>
          <ProgressBar value={progress} />
        </CardContent>
      )}
    </Card>
  );
}
