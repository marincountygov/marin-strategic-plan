import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Accessibility",
};

/**
 * Accessibility statement skeleton. Every county site needs one; fill in the
 * bracketed items before launch and keep the commitment section accurate.
 */
export default function AccessibilityPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Accessibility
      </h1>
      <div className="mt-6 space-y-4 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
        <p>
          {siteConfig.name} is designed to meet WCAG 2.2 Level AA. Pages are
          built to work with screen readers, keyboard navigation, and browser
          zoom, and to respect your system&apos;s motion and color-scheme
          preferences.
        </p>
        <p>
          If you have difficulty using any part of this site, contact
          [accessibility contact email or phone] and we will provide the
          information or service you need in an accessible form.
        </p>
      </div>
    </article>
  );
}
