/**
 * Helpers for meme-generator route head() metadata.
 *
 * Usage in a route file:
 *
 *   export const Route = createFileRoute("/")({
 *     component: Index,
 *     head: () => memeHead({
 *       title: "Your Logo Intensifies — Animated Logo GIF Maker",
 *       description: "Drop in any logo and instantly generate a shareable shake GIF.",
 *       url: "https://yourlogointensifies.lovable.app/",
 *       appName: "Your Logo Intensifies",
 *     }),
 *   });
 */

export interface MemeHeadInput {
  title: string;
  description: string;
  url: string;
  appName: string;
  ogImage?: string;
}

export function memeHead({
  title,
  description,
  url,
  appName,
  ogImage,
}: MemeHeadInput) {
  const meta = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: appName },
    { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (ogImage) {
    meta.push({ property: "og:image", content: ogImage });
    meta.push({ name: "twitter:image", content: ogImage });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: appName,
          url,
          description,
          applicationCategory: "MultimediaApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  };
}
