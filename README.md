# lovable-meme-kit

Drop-in React components and SEO helpers for building browser-based meme generators.

Live demo: https://memekit.lovable.app

## Install

```bash
npm install lovable-meme-kit
```

## Usage

```tsx
import { useState } from "react";
import {
  MemeTitle,
  ImageDropZone,
  ColorSwatchPicker,
  HowItWorks,
  DEFAULT_MEME_BG,
} from "lovable-meme-kit";
import "lovable-meme-kit/styles.css";

export function App() {
  const [bg, setBg] = useState(DEFAULT_MEME_BG);

  return (
    <>
      <MemeTitle prefix="your logo" title="INTENSIFIES" variant="glow" />
      <ImageDropZone onFile={(file) => console.log(file)} />
      <ColorSwatchPicker value={bg} onChange={setBg} />
      <HowItWorks paragraphs={["Drop image, hit download.", "Runs in your browser — no uploads, no watermarks."]} />
    </>
  );
}
```

For TanStack Router routes, add SEO with the `memeHead()` helper:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { memeHead } from "lovable-meme-kit";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => memeHead({
    title: "Your Logo Intensifies — Animated Logo GIF Maker",
    description: "Drop a logo, get a shake GIF.",
    url: "https://yourlogointensifies.lovable.app/",
    appName: "Your Logo Intensifies",
  }),
});
```

## Components

- `<MemeTitle />` — gradient hero title (variants: `rainbow`, `glow`).
- `<ImageDropZone />` — drag / paste / click upload surface.
- `<ColorSwatchPicker />` — background color row with transparent (checker) swatch.
- `<HowItWorks />` — SEO-friendly explainer block.
- `<MemeButton />` — kit-styled button (variants: `primary`, `secondary`).
- `<RangeSlider />` — labeled slider for tunable scalar params (intensity, blur, etc).
- `<MadeWithMemeKitFooter />` — drop-in footer with npm + GitHub + demo + Lovable links.
- `<TemplateMemeCanvas />` — Konva-based composition canvas for meme generators with a static template + draggable user-image hotspots. Use for "subject + template overlay" memes (e.g. Old Man Yells, Stonks-ify, GOAT-ify).
- `<MemeAppLayout />` — canonical page wrapper for kit-built meme generators (min-h-screen, bg-background, centered column).
- `<MemeAppMain />` — canonical main-content wrapper (max-width, centered gap, mt-6).
- `<MemeActions />` — canonical button row (flex, centered, gap-2, wrap).

`<ImageDropZone>` accepts `imageLoaded?: boolean` to enable an absolute click-to-upload overlay when children are provided (so canvas apps still get click-to-upload). Pass `imageLoaded={imageState != null}`.

**Live preview animations** (apply to your loaded image preview to approximate the GIF output):
- `animate-intensify` — random shake (Your Logo Intensifies pattern).
- `animate-bob` — slow vertical bob (Party-ify pattern).
- `animate-strobe` — rainbow hue-rotate cycle (Star Power pattern).
- `animate-bop` — fast head-bop translate (Catjam-ify pattern).

## Hooks

- `useImageFile()` — file upload state + FileReader → dataURL → HTMLImageElement.
- `useGifEncoder()` — gifenc-based animated GIF encoder with magenta chroma-key for transparent export. Pass a per-frame `drawFrame` callback.
- `useTemplateMemeGif()` — animated GIF export hook for `<TemplateMemeCanvas>`-composed memes. Snapshots the live stage at generate() time (preserving user's drag/transform), then renders N frames with optional per-frame animation deltas. Use for canvas + GIF combo apps (Catjam-ify, etc).

## Helpers

- `memeHead()` — TanStack Router `head()` helper (meta, OG, Twitter, canonical, JSON-LD WebApplication).
- `DEFAULT_MEME_COLORS` — palette including the `"transparent"` sentinel.
- `DEFAULT_MEME_BG` — recommended initial background (`"transparent"`).
- `exportStageToPng(stage, options?)` — trigger a PNG download of a Konva stage; hides Transformer handles before export.

## Requirements

- React 18 or 19.
- Tailwind CSS v4 with shadcn-style design tokens (`--background`, `--foreground`, `--border`, `--muted-foreground`, `--primary`, `--card`, etc.) — the components use semantic Tailwind classes that resolve against these.

## License

MIT

## SEO essentials

`memeHead()` covers the per-route head tags (title, meta, OG, Twitter, canonical, JSON-LD). The pieces below are per-app boilerplate the kit cannot ship for you — copy them into each new meme app.

### `public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://YOUR-APP.lovable.app/sitemap.xml
```

### `public/llms.txt`

```
# YOUR-APP

> One-line description of what the app does.

## Pages

- [Home](/): What the home page does.
```

### `src/routes/sitemap[.]xml.ts`

Use the `memeSitemapRoute` helper — three lines:

```ts
import { createFileRoute } from "@tanstack/react-router";
import { memeSitemapRoute } from "lovable-meme-kit";

export const Route = createFileRoute("/sitemap.xml")(
  memeSitemapRoute({ baseUrl: "https://YOUR-APP.lovable.app" })
);
```

Pass `paths: ["/", "/about", ...]` to add more routes (defaults to `["/"]`).

### `src/routes/__root.tsx` defaults

Replace the generic "Lovable App" / "Lovable Generated Project" defaults with app-specific ones — `memeHead()` will override these per route, but the root values are the fallback for any route that doesn't set its own:

```tsx
meta: [
  { charSet: "utf-8" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
  { title: "YOUR APP — Subtitle" },
  { name: "description", content: "One-line description." },
  { property: "og:type", content: "website" },
  // ... memeHead handles per-route overrides
],
```
