import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getPlan } from "@/lib/content/graph";

export const metadata: Metadata = {
  title: "About",
};

const INLINE_LINK_CLASS =
  "rounded font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900";

/** A paragraph is plain text, except authors occasionally need to link a
 *  word or phrase mid-sentence (e.g. "sharing your ideas through Engage
 *  Marin"). Rather than render arbitrary HTML from plan.json — a real
 *  injection risk even for trusted content — this recognizes exactly one
 *  narrow shape, `<a href="...">text</a>`, and turns just that into a real
 *  link; everything else stays literal text. */
function renderParagraph(text: string): ReactNode[] {
  const linkPattern = /<a href="([^"]+)">(.*?)<\/a>/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const [, href, label] = match;
    const external = href.startsWith("http");
    nodes.push(
      <a
        key={key++}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={INLINE_LINK_CLASS}
      >
        {label}
      </a>,
    );
    lastIndex = linkPattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export default function AboutPage() {
  const plan = getPlan();
  const sections = plan["marin:aboutSections"] ?? [];
  const newsletter = plan["marin:newsletter"];

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <h1 className="font-product-display text-3xl font-semibold text-stone-900 sm:text-4xl dark:text-stone-50">
        About {plan.name}
      </h1>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
              {section.heading}
            </h2>
            {section.paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300"
              >
                {renderParagraph(paragraph)}
              </p>
            ))}
          </section>
        ))}

        {newsletter && (
          <section>
            <h2 className="font-product-display text-xl font-semibold text-stone-900 dark:text-stone-50">
              {newsletter.heading}
            </h2>
            <p className="mt-2 font-product-body text-base leading-7 text-stone-700 dark:text-stone-300">
              {newsletter.body}
            </p>
            <a
              href={newsletter.linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block rounded font-product-body text-base font-medium text-marin-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-marin-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-marin-blue-300 dark:focus-visible:ring-marin-blue-400 dark:focus-visible:ring-offset-stone-900"
            >
              {newsletter.linkLabel} →
            </a>
          </section>
        )}
      </div>

      {plan["marin:closingTagline"] && (
        <p className="mt-12 font-product-display text-xl font-semibold text-marin-blue-700 dark:text-marin-blue-300">
          {plan["marin:closingTagline"]}
        </p>
      )}
    </article>
  );
}
