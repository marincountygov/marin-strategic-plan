import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy",
};

/** Privacy policy placeholder. Replace with counsel-approved language. */
export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Privacy
      </h1>
      <div className="mt-6 space-y-4 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
        <p>
          [Privacy policy for {siteConfig.name}. Replace this placeholder with
          County-approved language before launch.]
        </p>
      </div>
    </article>
  );
}
