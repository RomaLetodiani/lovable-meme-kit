import type Konva from "konva";

export interface ExportStageToPngOptions {
  /** Pixel ratio for the PNG (default 2 for retina). */
  pixelRatio?: number;
  /** Whether to hide Transformer handles before export (default true). */
  hideTransformers?: boolean;
  /** Filename for the download (default "meme.png"). */
  filename?: string;
}

/**
 * Triggers a PNG download of the given Konva stage. Hides Transformer handles
 * before export so they don't appear in the output, then restores them.
 */
export function exportStageToPng(
  stage: Konva.Stage | null,
  options: ExportStageToPngOptions = {},
): void {
  if (!stage) return;
  const { pixelRatio = 2, hideTransformers = true, filename = "meme.png" } = options;

  let transformers: Konva.Node[] = [];
  if (hideTransformers) {
    transformers = stage.find("Transformer");
    transformers.forEach((t) => t.hide());
    stage.draw();
  }

  const uri = stage.toDataURL({ pixelRatio });

  if (hideTransformers) {
    transformers.forEach((t) => t.show());
    stage.draw();
  }

  const link = document.createElement("a");
  link.download = filename;
  link.href = uri;
  link.click();
}
