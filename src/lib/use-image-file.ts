import { useEffect, useState } from "react";

export interface ImageFileState {
  /** Data URL (e.g. for `<img src>` or passing to a Konva image source). */
  dataUrl: string;
  /** Loaded HTMLImageElement (useful for canvas drawing). Null until image decodes. */
  image: HTMLImageElement | null;
  /** Natural width once decoded. 0 until then. */
  width: number;
  /** Natural height once decoded. 0 until then. */
  height: number;
}

export interface UseImageFileResult {
  state: ImageFileState | null;
  /** Pass to `<ImageDropZone onFile={...}>` or any `<input type=file>` change handler. */
  handleFile: (file: File) => void;
  reset: () => void;
}

/**
 * Hook that wraps the standard FileReader → data URL → HTMLImageElement flow
 * used by every meme generator's image upload path.
 *
 * Returns null until a file is loaded. After `handleFile`, `state.dataUrl` is
 * set immediately; `state.image` populates asynchronously once the image
 * decodes (so canvas-drawing code should null-check `state.image`).
 */
export function useImageFile(): UseImageFileResult {
  const [state, setState] = useState<ImageFileState | null>(null);

  useEffect(() => {
    if (!state?.dataUrl) return;
    if (state.image) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setState((prev) =>
        prev && prev.dataUrl === img.src
          ? {
              dataUrl: prev.dataUrl,
              image: img,
              width: img.naturalWidth,
              height: img.naturalHeight,
            }
          : prev,
      );
    };
    img.src = state.dataUrl;
  }, [state?.dataUrl, state?.image]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setState({ dataUrl, image: null, width: 0, height: 0 });
    };
    reader.readAsDataURL(file);
  };

  const reset = () => setState(null);

  return { state, handleFile, reset };
}
