import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design tokens",
};

/** Class names are static strings so Tailwind's scanner emits them. */
const RAMPS: { name: string; steps: { step: string; cls: string }[] }[] = [
  {
    name: "marin-blue",
    steps: [
      { step: "50", cls: "bg-marin-blue-50" },
      { step: "100", cls: "bg-marin-blue-100" },
      { step: "200", cls: "bg-marin-blue-200" },
      { step: "300", cls: "bg-marin-blue-300" },
      { step: "400", cls: "bg-marin-blue-400" },
      { step: "500", cls: "bg-marin-blue-500" },
      { step: "600", cls: "bg-marin-blue-600" },
      { step: "700", cls: "bg-marin-blue-700" },
      { step: "800", cls: "bg-marin-blue-800" },
      { step: "900", cls: "bg-marin-blue-900" },
      { step: "950", cls: "bg-marin-blue-950" },
    ],
  },
  {
    name: "marin-gold",
    steps: [
      { step: "50", cls: "bg-marin-gold-50" },
      { step: "100", cls: "bg-marin-gold-100" },
      { step: "200", cls: "bg-marin-gold-200" },
      { step: "300", cls: "bg-marin-gold-300" },
      { step: "400", cls: "bg-marin-gold-400" },
      { step: "500", cls: "bg-marin-gold-500" },
      { step: "600", cls: "bg-marin-gold-600" },
      { step: "700", cls: "bg-marin-gold-700" },
      { step: "800", cls: "bg-marin-gold-800" },
      { step: "900", cls: "bg-marin-gold-900" },
      { step: "950", cls: "bg-marin-gold-950" },
    ],
  },
  {
    name: "marin-red",
    steps: [
      { step: "50", cls: "bg-marin-red-50" },
      { step: "100", cls: "bg-marin-red-100" },
      { step: "200", cls: "bg-marin-red-200" },
      { step: "300", cls: "bg-marin-red-300" },
      { step: "400", cls: "bg-marin-red-400" },
      { step: "500", cls: "bg-marin-red-500" },
      { step: "600", cls: "bg-marin-red-600" },
      { step: "700", cls: "bg-marin-red-700" },
      { step: "800", cls: "bg-marin-red-800" },
      { step: "900", cls: "bg-marin-red-900" },
      { step: "950", cls: "bg-marin-red-950" },
    ],
  },
];

const ANCHORS: { name: string; cls: string; note: string }[] = [
  { name: "marin-green", cls: "bg-marin-green", note: "success anchor" },
  { name: "marin-brown", cls: "bg-marin-brown", note: "decorative" },
  {
    name: "marin-dark-gray",
    cls: "bg-marin-dark-gray",
    note: "secondary text on light",
  },
  {
    name: "marin-light-gray",
    cls: "bg-marin-light-gray",
    note: "background only — never text",
  },
];

export default function DesignTokensPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        Design tokens
      </h1>
      <p className="mt-3 max-w-2xl font-product-body text-stone-700 dark:text-stone-300">
        The county token system, rendered from the same classes a page would
        use. The full definitions and pairing rules live in{" "}
        <code className="font-product-mono text-sm">src/app/globals.css</code>.
      </p>

      <section className="mt-10" aria-labelledby="palettes-heading">
        <h2
          id="palettes-heading"
          className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50"
        >
          Color ramps
        </h2>
        {RAMPS.map((ramp) => (
          <div key={ramp.name} className="mt-6">
            <h3 className="font-product-mono text-sm text-stone-700 dark:text-stone-300">
              {ramp.name}
            </h3>
            <ul className="mt-2 grid grid-cols-6 gap-1 sm:grid-cols-11">
              {ramp.steps.map(({ step, cls }) => (
                <li key={step}>
                  <div
                    className={`h-12 rounded-md border border-stone-200 dark:border-stone-700 ${cls}`}
                  />
                  <span className="mt-1 block text-center font-product-mono text-xs text-stone-600 dark:text-stone-400">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10" aria-labelledby="anchors-heading">
        <h2
          id="anchors-heading"
          className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50"
        >
          Brand anchors
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-4">
          {ANCHORS.map(({ name, cls, note }) => (
            <li key={name}>
              <div
                className={`h-16 rounded-md border border-stone-200 dark:border-stone-700 ${cls}`}
              />
              <p className="mt-1 font-product-mono text-xs text-stone-600 dark:text-stone-400">
                {name}
              </p>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                {note}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="type-heading">
        <h2
          id="type-heading"
          className="font-product-display text-2xl font-semibold text-stone-900 dark:text-stone-50"
        >
          Typography
        </h2>
        <dl className="mt-4 space-y-6">
          <div>
            <dt className="font-product-mono text-xs text-stone-600 dark:text-stone-400">
              font-product-display — Jost, headings and display
            </dt>
            <dd className="mt-1 font-product-display text-3xl font-semibold text-stone-900 dark:text-stone-50">
              Civic services for everyone
            </dd>
          </div>
          <div>
            <dt className="font-product-mono text-xs text-stone-600 dark:text-stone-400">
              font-product-body — Open Sans, body copy
            </dt>
            <dd className="mt-1 max-w-2xl font-product-body text-base text-stone-700 dark:text-stone-300">
              Body text is set in Open Sans at 16px or larger. Secondary text
              uses marin-dark-gray on light surfaces and stone-400 on dark.
            </dd>
          </div>
          <div>
            <dt className="font-product-mono text-xs text-stone-600 dark:text-stone-400">
              font-product-mono — IBM Plex Mono, code-like values only
            </dt>
            <dd className="mt-1 font-product-mono text-sm text-stone-700 dark:text-stone-300">
              bg-marin-blue-500 · --uswds-unit-2 · 4a1f
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
