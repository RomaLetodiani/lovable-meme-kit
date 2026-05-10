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

## Hooks

- `useImageFile()` — file upload state + FileReader → dataURL → HTMLImageElement.
- `useGifEncoder()` — gifenc-based animated GIF encoder with magenta chroma-key for transparent export. Pass a per-frame `drawFrame` callback.

## Helpers

- `memeHead()` — TanStack Router `head()` helper (meta, OG, Twitter, canonical, JSON-LD WebApplication).
- `DEFAULT_MEME_COLORS` — palette including the `"transparent"` sentinel.
- `DEFAULT_MEME_BG` — recommended initial background (`"transparent"`).

## Requirements

- React 18 or 19.
- Tailwind CSS v4 with shadcn-style design tokens (`--background`, `--foreground`, `--border`, `--muted-foreground`, `--primary`, `--card`, etc.) — the components use semantic Tailwind classes that resolve against these.

## License

MIT
