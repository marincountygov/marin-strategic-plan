import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { getPlan } from "@/lib/content/graph";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  const plan = getPlan();
  const about = plan["marin:about"];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd
        data={{
          "@type": "FAQPage",
          mainEntity: plan["marin:faq"].map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }}
      />
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        About the {plan.name}
      </h1>

      <div className="mt-8 space-y-8">
        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Purpose
          </h2>
          <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
            {about.purpose}
          </p>
        </section>
        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Why this matters
          </h2>
          <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
            {about.whyItMatters}
          </p>
        </section>
        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Scope
          </h2>
          <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
            {about.scope}
          </p>
        </section>
        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Planning approach
          </h2>
          <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
            {about.planningApproach}
          </p>
        </section>
        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Expected outcomes
          </h2>
          <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
            {about.expectedOutcomes}
          </p>
        </section>

        <section>
          <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
            Frequently asked questions
          </h2>
          <dl className="mt-4 space-y-6">
            {plan["marin:faq"].map((item) => (
              <div key={item.question}>
                <dt className="font-product-body text-base font-semibold text-stone-900 dark:text-stone-50">
                  {item.question}
                </dt>
                <dd className="mt-1 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </article>
  );
}
