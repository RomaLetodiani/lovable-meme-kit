import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

export interface MemeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

/**
 * Reusable button for meme generators.
 * - `primary`: filled with the design system's primary color (download / main action).
 * - `secondary`: muted (reset / cancel / less prominent).
 *
 * Apps own the click logic (download a PNG, encode a GIF, etc); the kit owns
 * the visual identity so all kit-built apps share the same button look.
 */
export function MemeButton({
  variant = "primary",
  className,
  children,
  ...rest
}: MemeButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-medium transition",
        variant === "primary" &&
          "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "secondary" &&
          "bg-muted text-foreground hover:bg-muted/70",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      )}
    >
      {children}
    </button>
  );
}
