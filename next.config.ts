import type { NextConfig } from "next";

/**
 * The template ships in static-export mode so a site built from it deploys
 * anywhere that serves files: GitHub Pages, Vercel, county infrastructure.
 * `next build` writes the finished site to `out/`.
 *
 * - Serving from a subpath (GitHub Pages project site at /repo-name/): set
 *   NEXT_PUBLIC_BASE_PATH=/repo-name in the build environment.
 * - Need server features later (API routes, server actions, middleware)?
 *   Remove `output: "export"` and deploy to a Node host such as Vercel.
 *   Nothing else in the template assumes static export.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: {
    // The default next/image optimizer needs a server. Static export serves
    // images as-is; keep assets pre-sized (SVG preferred) as Engage Marin does.
    unoptimized: true,
  },
};

export default nextConfig;
