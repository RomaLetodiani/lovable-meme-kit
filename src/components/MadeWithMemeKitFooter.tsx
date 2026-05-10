import { cn } from "@/lib/utils";

export interface MadeWithMemeKitFooterProps {
  /** App name (optional). When set, renders "<appName> built with..." prefix. */
  appName?: string;
  /** App's source repo URL (optional). When set, adds a "Source" link. */
  appGithubUrl?: string;
  className?: string;
}

/**
 * Standard footer for kit-built meme generators. Drop into the bottom of the
 * page; renders attribution + links to npm, GitHub, demo, and Lovable.
 *
 * Default layout: small, centered, muted text. All links open in a new tab.
 */
export function MadeWithMemeKitFooter({
  appName,
  appGithubUrl,
  className,
}: MadeWithMemeKitFooterProps) {
  return (
    <footer
      className={cn(
        "mt-12 text-xs text-muted-foreground text-center max-w-prose mx-auto px-4 leading-relaxed",
        className,
      )}
    >
      <p>
        {appName ? `${appName} ` : ""}built with{" "}
        <a
          href="https://www.npmjs.com/package/lovable-meme-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          lovable-meme-kit
        </a>
        {" "}·{" "}
        <a
          href="https://github.com/RomaLetodiani/lovable-meme-kit"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          GitHub
        </a>
        {" "}·{" "}
        <a
          href="https://memekit.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Demo
        </a>
        {appGithubUrl && (
          <>
            {" "}·{" "}
            <a
              href={appGithubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Source
            </a>
          </>
        )}
      </p>
      <p className="mt-1">
        Made on{" "}
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground"
        >
          Lovable
        </a>
        {" "}· MIT licensed · No tracking, no uploads
      </p>
    </footer>
  );
}
