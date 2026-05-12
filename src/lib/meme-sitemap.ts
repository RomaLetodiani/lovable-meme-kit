export interface MemeSitemapOptions {
  /** Origin URL of the deployed app, e.g. "https://patpat.lovable.app" (no trailing slash). */
  baseUrl: string;
  /** Paths to include in the sitemap. Defaults to ["/"]. */
  paths?: string[];
}

/**
 * Returns a TanStack Start route config object for a `/sitemap.xml` route.
 *
 * Usage in `src/routes/sitemap[.]xml.ts`:
 *
 *   import { createFileRoute } from "@tanstack/react-router";
 *   import { memeSitemapRoute } from "lovable-meme-kit";
 *
 *   export const Route = createFileRoute("/sitemap.xml")(
 *     memeSitemapRoute({ baseUrl: "https://patpat.lovable.app" })
 *   );
 */
export function memeSitemapRoute(opts: MemeSitemapOptions) {
  const paths = opts.paths ?? ["/"];
  const items = paths
    .map(
      (p) =>
        `  <url>\n    <loc>${opts.baseUrl}${p}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${p === "/" ? "1.0" : "0.7"}</priority>\n  </url>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  return {
    server: {
      handlers: {
        GET: async () =>
          new Response(xml, {
            headers: {
              "Content-Type": "application/xml",
              "Cache-Control": "public, max-age=3600",
            },
          }),
      },
    },
  };
}
