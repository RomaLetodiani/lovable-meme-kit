import { useState } from "react";
import { GIFEncoder, quantize, applyPalette } from "gifenc";

const CHROMA = "#ff00ff"; // magenta key for transparent export

export interface UseGifEncoderOptions {
  width: number;
  height: number;
  /** Number of frames. Keep ≤ 12 for reasonable file size. Default 8. */
  frames?: number;
  /** Delay between frames in ms. Default 40. */
  delay?: number;
  /**
   * Background color string. Use `"transparent"` to enable the magenta chroma-key
   * path that produces a real-transparent GIF; otherwise the bg is filled with this color.
   */
  bgColor: string;
  /**
   * Per-frame draw callback. Called with the canvas context and the frame index (0..frames-1).
   * The kit fills the background BEFORE calling drawFrame; consumer's drawFrame composites on top.
   */
  drawFrame: (ctx: CanvasRenderingContext2D, frameIndex: number, frameCount: number) => void;
  /** Filename for the downloaded GIF. Default "meme.gif". */
  filename?: string;
}

export interface UseGifEncoderResult {
  /** Triggers encode + download. Resolves when the download has started. */
  generate: () => Promise<void>;
  /** True while encoding. Use to disable the download button. */
  busy: boolean;
}

/**
 * Generic GIF encoder hook for kit-built meme generators.
 *
 * Frame-drawing logic lives in the consumer (it varies per animation: shake,
 * pulse, rotate, etc); the kit owns the canvas creation, frame loop, gifenc
 * palette quantization, magenta chroma-key for transparent backgrounds, UI
 * yielding, blob creation, and download trigger.
 */
export function useGifEncoder(options: UseGifEncoderOptions): UseGifEncoderResult {
  const [busy, setBusy] = useState(false);

  const generate = async () => {
    const {
      width,
      height,
      frames = 8,
      delay = 40,
      bgColor,
      drawFrame,
      filename = "meme.gif",
    } = options;

    setBusy(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      const transparentMode = bgColor === "transparent";

      const gif = GIFEncoder();
      for (let i = 0; i < frames; i++) {
        ctx.fillStyle = transparentMode ? CHROMA : bgColor;
        ctx.fillRect(0, 0, width, height);
        drawFrame(ctx, i, frames);

        const { data } = ctx.getImageData(0, 0, width, height);
        const palette = quantize(data, 256);
        const index = applyPalette(data, palette);
        let frameOpts: Record<string, unknown> = { palette, delay };
        if (transparentMode) {
          let best = 0;
          let bestD = Infinity;
          for (let p = 0; p < palette.length; p++) {
            const [r, g, b] = palette[p];
            const d = (r - 255) ** 2 + g * g + (b - 255) ** 2;
            if (d < bestD) {
              bestD = d;
              best = p;
            }
          }
          frameOpts = {
            palette,
            delay,
            transparent: true,
            transparentIndex: best,
            dispose: 2,
          };
        }
        gif.writeFrame(index, width, height, frameOpts);
        await new Promise((r) => setTimeout(r, 0));
      }
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
