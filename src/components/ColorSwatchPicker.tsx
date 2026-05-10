import { cn } from "@/lib/utils";

export const DEFAULT_MEME_COLORS = [
  "transparent",
  "#ffffff",
  "#e53935",
  "#ef6c00",
  "#fb8c00",
  "#fdd835",
  "#c0ca33",
  "#7cb342",
  "#43a047",
  "#00897b",
  "#26c6da",
  "#039be5",
  "#1e88e5",
  "#3949ab",
  "#5e35b1",
  "#8e24aa",
  "#d81b60",
  "#f06292",
  "#8d6e63",
  "#000000",
] as const;

/**
 * Recommended initial background color for meme generators.
 * Renders the checker pattern via the `bg-checker` utility class.
 * Equal to `DEFAULT_MEME_COLORS[0]` by convention.
 */
export const DEFAULT_MEME_BG = "transparent" as const;

export interface ColorSwatchPickerProps {
  value: string;
  onChange: (color: string) => void;
  colors?: readonly string[];
  size?: "sm" | "md";
  label?: string;
  className?: string;
}

/**
 * Reusable background color picker for meme generators.
 * Includes a "transparent" swatch with a checker pattern.
 */
export function ColorSwatchPicker({
  value,
  onChange,
  colors = DEFAULT_MEME_COLORS,
  size = "md",
  label,
  className,
}: ColorSwatchPickerProps) {
  const dim = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className={cn("w-full", className)}>
      {label && <div className="text-xs text-muted-foreground mb-1">{label}</div>}
      <div className="flex flex-wrap gap-1.5">
        {colors.map((c) => {
          const isTransparent = c === "transparent";
          const selected = value === c;
          return (
            <button
              type="button"
              key={c}
              aria-label={isTransparent ? "Transparent background" : `Background ${c}`}
              title={isTransparent ? "Transparent" : c}
              onClick={() => onChange(c)}
              className={cn(
                dim,
                "rounded-sm border transition",
                selected ? "ring-2 ring-foreground" : "border-border",
                isTransparent && "bg-checker",
              )}
              style={isTransparent ? undefined : { backgroundColor: c }}
            />
          );
        })}
      </div>
    </div>
  );
}
