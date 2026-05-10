import { useState, type RefObject } from "react";
import type Konva from "konva";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

const CHROMA = "#ff00ff";

export interface MemeGifAnimation {
  /** Per-frame transform applied to the template image. Deltas added to its base position. */
  template?: { x?: number; y?: number; rotation?: number; scale?: number };
  /** Per-frame transforms applied per hotspot id. Deltas added to current hotspot position. */
  hotspots?: Record<
    string,
    { x?: number; y?: number; rotation?: number; scale?: number }
  >;
}

export interface UseTemplateMemeGifOptions {
  /** Ref to the live Konva stage rendered by `<TemplateMemeCanvas>`. Read at generate() time. */
  stageRef: RefObject<Konva.Stage | null>;
  /** Frame count. Default 8. */
  frames?: number;
  /** Delay between frames in ms. Default 80. */
  delay?: number;
  /**
   * Per-frame animation callback. Returns deltas for template + per-hotspot.
   * Used to animate static stage state (e.g. catjam head bop, pulse, sway).
   */
  animate?: (frameIndex: number, frameCount: number) => MemeGifAnimation;
  /** Filename for the downloaded GIF. Default "meme.gif". */
  filename?: string;
}

export interface UseTemplateMemeGifResult {
  generate: () => Promise<void>;
  busy: boolean;
}

/**
 * GIF export hook for `<TemplateMemeCanvas>`-composed memes with per-frame animation.
 * Snapshots the live stage at generate() time (preserving user's drag/transform),
 * then renders N frames applying the optional animate() callback's deltas, and encodes
 * as GIF (with magenta chroma-key for transparent backgrounds, matching useGifEncoder).
 */
export function useTemplateMemeGif(
  options: UseTemplateMemeGifOptions,
): UseTemplateMemeGifResult {
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    const {
      stageRef,
      frames = 8,
      delay = 80,
      animate,
      filename = "meme.gif",
    } = options;

    const stage = stageRef.current;
    if (!stage) return;

    setBusy(true);
    try {
      const width = stage.width();
      const height = stage.height();

      const transformers = stage.find("Transformer");
      transformers.forEach((t) => t.hide());
      stage.draw();

      const templateNode = stage.findOne("#template") as Konva.Image | null;
      const hotspotNodes = stage.find(".hotspot-image") as Konva.Image[];

      const templateBase = templateNode
        ? {
            x: templateNode.x(),
            y: templateNode.y(),
            rotation: templateNode.rotation(),
            scaleX: templateNode.scaleX(),
            scaleY: templateNode.scaleY(),
          }
        : null;

      const hotspotBases = new Map<string, {
        x: number; y: number; rotation: number; scaleX: number; scaleY: number;
        node: Konva.Image;
      }>();
      hotspotNodes.forEach((n) => {
        const id = n.attrs["data-hotspot-id"] as string | undefined;
        if (!id) return;
        hotspotBases.set(id, {
          x: n.x(),
          y: n.y(),
          rotation: n.rotation(),
          scaleX: n.scaleX(),
          scaleY: n.scaleY(),
          node: n,
        });
      });

      const gif = GIFEncoder();
      const ctx = document.createElement("canvas");
      ctx.width = width;
      ctx.height = height;
      const c = ctx.getContext("2d", { willReadFrequently: true })!;

      const bgRect = stage.findOne("#bg-rect") as Konva.Rect | null;
      const bgColor = bgRect ? (bgRect.fill() as string) : "transparent";
      const transparentMode = bgColor === "transparent";

      for (let i = 0; i < frames; i++) {
        const overrides = animate?.(i, frames) ?? {};

        if (templateNode && templateBase) {
          templateNode.x(templateBase.x + (overrides.template?.x ?? 0));
          templateNode.y(templateBase.y + (overrides.template?.y ?? 0));
          templateNode.rotation(templateBase.rotation + (overrides.template?.rotation ?? 0));
          const tScale = overrides.template?.scale ?? 1;
          templateNode.scaleX(templateBase.scaleX * tScale);
          templateNode.scaleY(templateBase.scaleY * tScale);
        }
        hotspotBases.forEach((base, id) => {
          const ov = overrides.hotspots?.[id] ?? {};
          base.node.x(base.x + (ov.x ?? 0));
          base.node.y(base.y + (ov.y ?? 0));
          base.node.rotation(base.rotation + (ov.rotation ?? 0));
          const hScale = ov.scale ?? 1;
          base.node.scaleX(base.scaleX * hScale);
          base.node.scaleY(base.scaleY * hScale);
        });

        stage.draw();
        const dataUrl = stage.toDataURL({ pixelRatio: 1 });
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Frame render failed"));
          img.src = dataUrl;
        });

        c.fillStyle = transparentMode ? CHROMA : (bgColor as string);
        c.fillRect(0, 0, width, height);
        c.drawImage(img, 0, 0, width, height);

        const { data } = c.getImageData(0, 0, width, height);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        let frameOpts: Record<string, unknown> = { palette, delay };
        if (transparentMode) {
          let best = 0;
          let bestD = Infinity;
          for (let p = 0; p < palette.length; p++) {
            const [r, g, b] = palette[p];
            const d = (r - 255) ** 2 + g * g + (b - 255) ** 2;
            if (d < bestD) { bestD = d; best = p; }
          }
          frameOpts = { palette, delay, transparent: true, transparentIndex: best, dispose: 2 };
        }
        gif.writeFrame(index, width, height, frameOpts);
        await new Promise((r) => setTimeout(r, 0));
      }

      if (templateNode && templateBase) {
        templateNode.x(templateBase.x);
        templateNode.y(templateBase.y);
        templateNode.rotation(templateBase.rotation);
        templateNode.scaleX(templateBase.scaleX);
        templateNode.scaleY(templateBase.scaleY);
      }
      hotspotBases.forEach((base) => {
        base.node.x(base.x);
        base.node.y(base.y);
        base.node.rotation(base.rotation);
        base.node.scaleX(base.scaleX);
        base.node.scaleY(base.scaleY);
      });
      transformers.forEach((t) => t.show());
      stage.draw();

      gif.finish();
      const bytes = gif.bytes();
      const buf = new Uint8Array(bytes.byteLength);
      buf.set(bytes);
      const blob = new Blob([buf], { type: "image/gif" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setBusy(false);
    }
  };

  return { generate, busy };
}
