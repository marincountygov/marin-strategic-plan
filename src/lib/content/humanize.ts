/**
 * Split out from components/content/JsonValue.tsx on purpose: that file
 * also imports getById() from graph.ts (which imports node:fs), so a
 * client component that only needs the key-humanizing string logic — not
 * the @id-resolving JsonValue renderer — would otherwise drag node:fs into
 * the browser bundle just by sharing a file with it (bit the admin UI once
 * already; see the same reasoning in content-files.ts).
 *
 * "marin:currentValue" -> "Current Value", "@id" -> "@id" (left alone —
 * still meaningful as-is), "startDate" -> "Start Date".
 */
export function humanizeKey(key: string): string {
  if (key.startsWith("@")) return key;
  const withoutPrefix = key.replace(/^marin:/, "");
  const spaced = withoutPrefix.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
