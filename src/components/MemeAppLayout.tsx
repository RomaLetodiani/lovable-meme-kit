import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MemeAppLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Canonical page wrapper for kit-built meme generators. Provides the
 * standard min-h-screen, background, and centered column layout used
 * by every meme app in the lovable-meme-kit family.
 *
 * Drop in as the outermost `<div>` of a route component. `<MemeAppMain>`
 * is the inner wrapper for the controls/canvas/footer.
 */
export function MemeAppLayout({ children, className }: MemeAppLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background flex flex-col items-center px-4 py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}
