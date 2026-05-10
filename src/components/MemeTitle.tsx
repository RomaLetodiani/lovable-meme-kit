import { cn } from "@/lib/utils";

export interface MemeTitleProps {
  /** Small line above the main title. */
  prefix?: string;
  /** The big gradient title. */
  title: string;
  /** Tagline below. */
  tagline?: string;
  /** Gradient style for the main title. */
  variant?: "rainbow" | "glow";
  /** Font for prefix + title. Map a class to your project's @font-face. */
  fontClass?: string;
  className?: string;
}

/**
 * Reusable meme generator hero title with gradient text.
 * Use `variant="rainbow"` for playful (Old Man Yells style) or
 * `variant="glow"` for the orange "INTENSIFIES" hot-glow style.
 */
export function MemeTitle({
  prefix,
  title,
  tagline,
  variant = "rainbow",
  fontClass,
  className,
}: MemeTitleProps) {
  const titleClass = variant === "rainbow" ? "title-rainbow" : "title-glow";

  return (
    <header className={cn("text-center mb-6", className)}>
      <h1 className="leading-tight">
        {prefix && (
          <span
            className={cn(
              "block text-2xl md:text-3xl text-foreground",
              fontClass,
            )}
          >
            {prefix}
          </span>
        )}
        <span
          className={cn(
            "block mt-1 text-4xl md:text-5xl",
            titleClass,
            fontClass,
          )}
        >
          {title}
        </span>
      </h1>
      {tagline && (
        <p className="text-sm text-muted-foreground mt-2">{tagline}</p>
      )}
    </header>
  );
}
