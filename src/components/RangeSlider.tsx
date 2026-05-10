import { cn } from "@/lib/utils";

export interface RangeSliderProps {
  /** Label shown left of the slider. */
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Show the current numeric value on the right. Default true. */
  showValue?: boolean;
  className?: string;
}

/**
 * Labeled range slider primitive. Layout: label (left) — slider (flex) — value (right).
 * Used for tunable scalar params on meme generators (intensity, blur, rotation, etc).
 */
export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  className,
}: RangeSliderProps) {
  return (
    <div className={cn("w-full flex items-center gap-3", className)}>
      {label && (
        <span className="text-xs text-muted-foreground w-20">{label}</span>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1"
      />
      {showValue && (
        <span className="text-xs text-muted-foreground w-8 text-right">
          {value}
        </span>
      )}
    </div>
  );
}
