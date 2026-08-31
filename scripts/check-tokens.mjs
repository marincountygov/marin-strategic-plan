/**
 * Fails when site code styles with arbitrary Tailwind values (bg-[#0777CF],
 * text-[13px], w-[420px]) instead of the token system in globals.css.
 *
 * Scope: src/app and src/components, excluding src/components/ui (vendored
 * shadcn primitives follow upstream styling and are exempt). Arbitrary
 * VARIANTS (supports-[...], data-[...]) are fine — only arbitrary values on
 * token-bound properties are flagged.
 *
 * Escape hatch: a line containing `token-check-allow` is skipped. Use it
 * rarely and say why in a comment on the same line.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const ROOTS = ["src/app", "src/components"];
const EXCLUDE = "src/components/ui";
const PROPS =
  "bg|text|border|outline|ring|fill|stroke|shadow|rounded|font|leading|tracking|gap|size|w|h|min-w|min-h|max-w|max-h|p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|inset|top|right|bottom|left|z|basis|grow|shrink";
const ARBITRARY = new RegExp(
  `(?:^|[\\s"'\`{:])(?:[\\w-]+[:!])*(?:${PROPS})-\\[[^\\]]+\\]`,
);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (relative(process.cwd(), path).startsWith(EXCLUDE)) continue;
    if (entry.isDirectory()) yield* walk(path);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name)) yield path;
  }
}

const hits = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      if (line.includes("token-check-allow")) return;
      const match = line.match(ARBITRARY);
      if (match) {
        hits.push(`${relative(process.cwd(), file)}:${i + 1}  ${match[0].trim()}`);
      }
    });
  }
}

if (hits.length > 0) {
  console.error(
    "Arbitrary Tailwind values found. Use the token system in src/app/globals.css\n" +
      "(see AGENTS.md § Design tokens). To exempt a line, add `token-check-allow`\n" +
      "with a comment explaining why.\n",
  );
  for (const hit of hits) console.error("  " + hit);
  process.exit(1);
}

console.log("check:tokens ok — no arbitrary values outside the token system.");
