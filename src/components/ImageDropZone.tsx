import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ImageDropZoneProps {
  onFile: (file: File) => void;
  /** Listen for global paste events. Default true. */
  enablePaste?: boolean;
  className?: string;
  children?: ReactNode;
  /** Custom placeholder shown when children is empty. */
  placeholder?: ReactNode;
  /** Style applied to outer wrapper (size, background, etc). */
  style?: React.CSSProperties;
  /**
   * Whether an image is currently loaded inside the drop zone. When `false`
   * (the default) and children ARE provided, the kit renders an absolute
   * positioned `<label>` overlay with hidden `<input type="file">` so click
   * also opens the file picker. When `true`, the overlay is hidden so
   * children (e.g. a Konva canvas with draggable image) can receive clicks.
   *
   * Has no effect when children are NOT provided (the default placeholder
   * already handles click-to-upload via its own label).
   */
  imageLoaded?: boolean;
}

/**
 * Reusable image upload surface that supports:
 *  - drag & drop
 *  - clipboard paste (global)
 *  - click-to-upload via hidden file input
 *
 * Pass children to render the canvas/preview inside. When no children are
 * provided, a default "Drop image / click" placeholder is shown.
 */
export function ImageDropZone({
  onFile,
  enablePaste = true,
  className,
  children,
  placeholder,
  style,
  imageLoaded,
}: ImageDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!enablePaste) return;
    const handler = (e: ClipboardEvent) => {
      const item = Array.from(e.clipboardData?.items || []).find((i) =>
        i.type.startsWith("image/"),
      );
      const file = item?.getAsFile();
      if (file) onFile(file);
    };
    window.addEventListener("paste", handler);
    return () => window.removeEventListener("paste", handler);
  }, [enablePaste, onFile]);

  const handleFile = (file: File | undefined | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      className={cn(
        "relative rounded-md border-[3px] overflow-hidden",
        dragOver ? "border-primary" : "border-border",
        className,
      )}
      style={style}
    >
      {children ?? (
        <label className="flex h-full w-full items-center justify-center cursor-pointer text-sm text-muted-foreground text-center bg-background/70 p-6">
          {placeholder ?? (
            <span>
              Drop image
              <br />
              or click
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
      {children && !imageLoaded && (
        <label
          className="absolute inset-0 z-10 cursor-pointer"
          aria-label="Click to upload image"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}
