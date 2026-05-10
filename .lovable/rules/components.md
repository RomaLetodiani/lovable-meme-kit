# Meme Generator Components

Reusable building blocks for any browser-based meme generator. Import via the
`@/` alias.

## `<MemeTitle />` — `src/components/MemeTitle.tsx`

Hero title with a gradient main line. Use for the top of every meme page.

Props: `prefix?`, `title`, `tagline?`, `variant?: "rainbow" | "glow"`, `fontClass?`.

- `variant="rainbow"` — playful pink/blue gradient (Old Man Yells vibe). Pair with `font-homer`.
- `variant="glow"` — hot orange glow (INTENSIFIES vibe). Pair with `font-impact`.

```tsx
<MemeTitle prefix="old man yells at..." title="meme generator" variant="rainbow" fontClass="font-homer" />
```

## `<ImageDropZone />` — `src/components/ImageDropZone.tsx`

Composable upload surface. Handles drag & drop, global clipboard paste, and
click-to-upload simultaneously. Render your canvas/preview as children; if no
children are passed, a default placeholder is shown.

```tsx
<ImageDropZone
  onFile={handleFile}
  className={bg === "transparent" ? "bg-checker" : ""}
  style={{ width: 480, height: 480 }}
>
  {loaded ? <canvas /> : null}
</ImageDropZone>
```

## `<ColorSwatchPicker />` — `src/components/ColorSwatchPicker.tsx`

Background color row including a `"transparent"` swatch that renders the
checker pattern. Use the exported `DEFAULT_MEME_COLORS` or pass your own.

```tsx
<ColorSwatchPicker value={bg} onChange={setBg} label="Background" />
```

## `<HowItWorks />` — `src/components/HowItWorks.tsx`

The standard explainer section that goes at the bottom of every meme page
(important for SEO — gives crawlers real content). Pass an array of paragraphs.

```tsx
<HowItWorks paragraphs={[
  "Drop an image, tweak it, hit download.",
  "Runs in your browser — no uploads, no watermarks, no sign-up.",
]} />
```

## `memeHead()` — `src/lib/meme-seo.ts`

Helper that returns a complete `head()` object for a TanStack route: title,
description, OG tags, Twitter tags, canonical link, and JSON-LD
`WebApplication` schema. Always use this instead of hand-rolling meta.
