# SEO for Meme Generators

Meme generator landing pages live or die by SEO. Follow this checklist for
every project built from this library.

## 1. Use `memeHead()` in every route

Don't hand-write `meta` arrays. Import the helper:

```ts
import { memeHead } from "@/lib/meme-seo";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => memeHead({
    title: "Old Man Yells At — Free Meme Generator",
    description: "Turn anything into the classic 'Old man yells at...' meme. In-browser, no sign-up, no watermarks.",
    url: "https://oldmanyellsat.lovable.app/",
    appName: "Old Man Yells At",
    ogImage: "https://oldmanyellsat.lovable.app/og.png", // optional but recommended
  }),
});
```

This emits: `<title>`, `meta description`, `og:title/description/url/type`,
`og:site_name`, twitter card tags, `<link rel="canonical">`, and a
`SoftwareApplication` JSON-LD script with `price: "0"`.

## 2. Title rules

- Under 60 characters
- Lead with the meme name + the noun "meme generator" or "GIF maker"
- Examples: `"Old Man Yells At — Free Meme Generator"`,
  `"Your Logo Intensifies — Animated Logo GIF Maker"`

## 3. Description rules

- Under 160 characters
- State the action ("Drop a logo, get a shake GIF")
- Mention the value props: free, in-browser, no sign-up, no watermarks

## 4. Real content on the page

Crawlers need text. Always include the `<HowItWorks />` section (2–3 paragraphs)
near the bottom. Repeat the meme name and the value props in prose — naturally,
not stuffed.

## 5. Single H1

`<MemeTitle />` renders the only `<h1>` on the page. Section titles use `<h2>`.
`<HowItWorks />` already uses `<h2>` correctly.

## 6. Sitemap & robots

Use the `memeSitemapRoute()` helper from the kit in
`src/routes/sitemap[.]xml.ts` — three-line file, just pass `baseUrl` (and
optional `paths`). Pair it with a `public/robots.txt` and a `public/llms.txt`.
See the **SEO essentials** section in the kit's README for the exact
templates plus the `__root.tsx` defaults cleanup.

## 7. Image alt text

Every `<img>` (including the canvas placeholder fallback) needs descriptive
`alt` text. Use the meme name, e.g. `alt="Old man yells at meme preview"`.
