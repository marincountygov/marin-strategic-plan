import { JSONLD_CONTEXT } from "@/lib/content/context";

/** Embeds one or more content-graph nodes as a JSON-LD <script> tag, so the
 *  same structured data that renders the page is also machine-readable by
 *  search engines and AI agents. */
export function JsonLd({ data }: { data: object | object[] }) {
  const graph = Array.isArray(data) ? data : [data];
  const json = JSON.stringify({ "@context": JSONLD_CONTEXT, "@graph": graph })
    // Prevent premature </script> termination if a string value ever contains it.
    .replace(/</g, "\\u003c");

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
