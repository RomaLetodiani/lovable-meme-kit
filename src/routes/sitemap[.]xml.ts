import { createFileRoute } from "@tanstack/react-router";
import { memeSitemapRoute } from "@/lib/meme-sitemap";

export const Route = createFileRoute("/sitemap.xml")(
  memeSitemapRoute({ baseUrl: "https://memekit.lovable.app" }),
);
