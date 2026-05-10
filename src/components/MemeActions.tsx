import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MemeActionsProps {
  children: ReactNode;
  className?: string;
}

/**
 * Canonical button row wrapper. Use as the parent of one or more
 * `<MemeButton>` elements (typically primary download + secondary reset).
 * Centers, wraps on overflow, consistent gap.
 */
export function MemeActions({ children, className }: MemeActionsProps) {
  return (
    <div className={cn("flex gap-2 justify-center flex-wrap", className)}>
      {children}
    </div>
  );
}
