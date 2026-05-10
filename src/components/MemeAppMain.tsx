import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface MemeAppMainProps {
  children: ReactNode;
  className?: string;
  /** Max width of the main content column. Default 640px. */
  maxWidth?: number;
}

/**
 * Canonical main-content wrapper. Sits inside `<MemeAppLayout>` after
 * `<MemeTitle>`. Centers controls, sets max width, applies consistent
 * vertical gap.
 */
export function MemeAppMain({
  children,
  className,
  maxWidth = 640,
}: MemeAppMainProps) {
  return (
    <main
      className={cn(
        "w-full flex flex-col items-center gap-4 mt-6",
        className,
      )}
      style={{ maxWidth: `${maxWidth}px` }}
    >
      {children}
    </main>
  );
}
