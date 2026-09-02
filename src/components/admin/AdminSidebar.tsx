"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { COLLECTIONS } from "@/app/admin/collection-meta";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin sections" className="w-56 shrink-0">
      <Link
        href="/"
        className="mb-4 flex items-center gap-1 rounded font-product-body text-sm text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
        Back to site
      </Link>
      <ul className="space-y-0.5">
        {COLLECTIONS.map((collection) => {
          const href = `/admin/${collection.slug}`;
          const active = pathname === href;
          const Icon = collection.icon;
          return (
            <li key={collection.file}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 font-product-body text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900 ${
                  active
                    ? "bg-marin-blue-50 font-medium text-marin-blue-700 dark:bg-marin-blue-950 dark:text-marin-blue-300"
                    : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
                }`}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{collection.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
