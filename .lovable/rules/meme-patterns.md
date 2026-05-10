# Meme Generator Patterns

Conventions every meme generator built from this library should follow.

## Core principles

1. **100% client-side.** Never upload user images to a server. All processing
   (canvas, GIF encoding, downloads) happens in-browser. Mention this in the
   "How it works" section — users care about it.
2. **No watermarks, no sign-up, free forever.** Repeat this in copy and JSON-LD.
3. **Square or near-square stage.** Pick a fixed `STAGE` size (e.g. 400, 480,
   520) and design the layout around it. Don't try to be responsive inside the
   canvas — let the page scale, keep the canvas pixel-exact.

## Standard page structure

```
<MemeTitle />                       ← gradient hero
<ImageDropZone>                     ← canvas container, also the upload surface
  <Canvas / Konva Stage / <img/> />
</ImageDropZone>
<controls />                        ← intensity sliders, etc (optional)
<ColorSwatchPicker />               ← background color
<download / reset buttons />
<HowItWorks />                      ← 2-3 paragraphs of plain prose for SEO
```

Width: keep the main column at `max-w-[520px]` and center the page.

## Upload behavior

A meme generator MUST accept input three ways simultaneously:
- Drag & drop onto the canvas
- Paste from clipboard (global `paste` listener)
- Click to upload (hidden `<input type="file" accept="image/*" />`)

`<ImageDropZone />` already does all three — just pass `onFile`.

## Transparent background

Use `"transparent"` as the sentinel color value. Render the checker pattern via
the `bg-checker` utility class on the canvas wrapper. For raster export
(PNG/GIF), either use a real alpha channel (Konva `toDataURL`) or a magenta
chroma-key trick (see "Your Logo Intensifies" GIF encoder).

## Export

- PNG: use `stage.toDataURL({ pixelRatio: 2 })` (Konva) or `canvas.toDataURL()`,
  then trigger an `<a download>` click. Hide transformer handles before export.
- GIF: use `gifenc` (`GIFEncoder`, `quantize`, `applyPalette`). Keep frame
  count low (≤ 12) and yield to UI between frames with `await new Promise(r => setTimeout(r, 0))`.

## Fonts

Two display fonts ship in `styles.css`:
- `font-homer` — Homer Simpson Revised webfont, for playful Simpsons-y titles
- `font-impact` — system Impact / Haettenschweiler / Oswald fallback, for the
  classic top-text/bottom-text meme look

Add new fonts to `src/styles.css` with `@font-face` + a utility class — never
hardcode `font-family` in components.

## Colors

Use semantic Tailwind tokens (`bg-background`, `text-foreground`, `border-border`,
`bg-primary`, etc.) for chrome. The meme palette inside the canvas is its own
thing — use `DEFAULT_MEME_COLORS` from `ColorSwatchPicker` or override per app.
