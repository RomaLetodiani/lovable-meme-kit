# Future: `<TemplateMemeCanvas />`

Plan-only. Extract when 2+ apps need a Konva canvas with a static template + draggable user image overlay. Currently only Old Man Yells fits this pattern.

## Pattern observed in N=1 (Old Man Yells, `f4e1e85e-...`)

OMY's `src/components/MemeCanvas.tsx`:
- Stage: 400×300 fixed.
- Template image: `old-man.png` rendered at `OLD_MAN_W = 320`, anchored bottom-right (`y = STAGE_H - templateHeight`).
- One user-image hotspot: initial position targets the old man's "fist" coords (`fistCenterX = stageW - 320 + 320*0.18`, `fistCenterY = 8 + 55`). Initial size 110×110, contained within.
- User image: draggable + transformable (Konva Transformer, rotate enabled, anchor handles).
- Background: solid color from `bgColor`, or no fill when `"transparent"` (parent container shows checker pattern).
- Export: `stage.toDataURL({ pixelRatio: 2 })`, with transformers hidden during export.

## Anticipated generic API (when N=2)

```tsx
<TemplateMemeCanvas
  width={400}
  height={300}
  bgColor={bgColor}
  template={{
    src: oldManSrc,
    width: 320,
    anchor: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center" | { x, y },
  }}
  hotspots={[
    {
      id: "subject",
      initialPosition: { x: 80, y: 8, w: 110, h: 110 },
      placeholderShape: "circle" | "rect",
      placeholderText: "Drop image here",
      image: dataUrl | null,
      onChange: (transform) => void,
      draggable: true,
      transformable: true,
    },
  ]}
  ref={stageRef}
/>
```

## Open questions for v1.2.0 design pass

- Multi-hotspot API: do hotspots need labels / per-hotspot color? (Drake meme: 2 hotspots, no labels needed.)
- Caption support: should template be just an image, or also support overlaid text? (Distracted Boyfriend: template + 3 captions.)
- Aspect-ratio handling: keep fixed pixel size or allow responsive sizing?
- Konva is a heavy dep (~150KB). Alternative for simpler layouts: pure HTML/CSS positioning of `<img>` elements with `react-rnd` for drag/resize.

Defer until at least one more app is in scope. Once we have 2 real consumers, the right shape will be obvious from triangulating the actual needs.

## v1.2.0 status

Shipped 2026-05-10. `<TemplateMemeCanvas>` + `exportStageToPng` exported. v1.0 of the API supports single-hotspot pattern (matches OMY usage and the planned Stonks-ify / GOAT-ify shape). Multi-hotspot + caption + responsive sizing remain v1.3+ scope.
