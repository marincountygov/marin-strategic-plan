import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getAncestorChain } from "@/lib/content/graph";
import { urlForNode } from "@/lib/content/routes";
import type { BaseEntity } from "@/lib/content/schema";

/** Breadcrumbs computed from the isPartOf chain, not the URL shape — a
 *  Milestone's breadcrumb walks Project → Initiative → Strategy →
 *  Objective → Goal → Theme regardless of its own flat /milestones/ route. */
export function Breadcrumbs({ node }: { node: BaseEntity }) {
  const ancestors = getAncestorChain(node);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Overview</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {ancestors.map((ancestor) => (
          <Fragment key={ancestor["@id"]}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={urlForNode(ancestor)}>{ancestor.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{node.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
