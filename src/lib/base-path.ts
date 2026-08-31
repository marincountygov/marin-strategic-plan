/** Matches next.config.ts's basePath: needed for client-side fetches of
 *  static assets in public/, since Next only rewrites <Link>/router paths
 *  automatically, not raw fetch() URLs. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
