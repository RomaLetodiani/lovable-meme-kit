import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HowItWorksProps {
  title?: string;
  paragraphs: ReactNode[];
  className?: string;
}

/**
 * Standard "How it works" section used across meme generators.
 * Pass an array of paragraphs (strings or JSX). Renders semantic <h2> + <p>s.
 */
export function HowItWorks({
  title = "How it works",
  paragraphs,
  className,
}: HowItWorksProps) {
  return (
    <section
      className={cn(
        "mt-6 max-w-prose text-sm text-muted-foreground space-y-3 text-center",
        className,
      )}
    >
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </section>
  );
}
