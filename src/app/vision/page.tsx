import type { Metadata } from "next";
import { getPlan } from "@/lib/content/graph";

export const metadata: Metadata = {
  title: "Vision",
};

export default function VisionPage() {
  const plan = getPlan();

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Vision &amp; Values
      </h1>

      <section className="mt-8">
        <h2 className="font-product-display text-sm font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
          Vision
        </h2>
        <p className="mt-2 font-product-display text-2xl font-medium text-stone-900 dark:text-stone-50">
          {plan["marin:vision"]}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-product-display text-sm font-semibold tracking-wide text-marin-dark-gray uppercase dark:text-stone-400">
          Mission
        </h2>
        <p className="mt-2 font-product-body text-lg leading-8 text-stone-700 dark:text-stone-300">
          {plan["marin:mission"]}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
          Core values
        </h2>
        <dl className="mt-4 space-y-6">
          {plan["marin:values"].map((value) => (
            <div key={value.name}>
              <dt className="font-product-display text-base font-semibold text-marin-blue-700 dark:text-marin-blue-300">
                {value.name}
              </dt>
              <dd className="mt-1 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
                {value.description}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </article>
  );
}
