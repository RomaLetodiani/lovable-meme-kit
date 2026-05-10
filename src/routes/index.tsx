import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ColorSwatchPicker } from "@/components/ColorSwatchPicker";
import { ImageDropZone } from "@/components/ImageDropZone";
import { HowItWorks } from "@/components/HowItWorks";
import { MemeTitle } from "@/components/MemeTitle";
import { memeHead } from "@/lib/meme-seo";

export const Route = createFileRoute("/")({
  component: Library,
  head: () =>
    memeHead({
      title: "Meme Generator Component Library",
      description:
        "Reusable components and patterns for building browser-based meme generators: color picker, drop zone, gradient titles, SEO helper.",
      url: "https://memekit.lovable.app/",
      appName: "Meme Generator Component Library",
    }),
});

function Library() {
  const [bg, setBg] = useState<string>("#ffffff");
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 py-10">
      <MemeTitle
        prefix="meme generator"
        title="component kit"
        tagline="Drop-in pieces for building browser meme tools."
        variant="rainbow"
        fontClass="font-homer"
      />

      <main className="w-full max-w-3xl flex flex-col gap-10">
        <Section
          name="<MemeTitle />"
          desc="Hero with prefix, gradient title and tagline. Variants: rainbow, glow."
        >
          <MemeTitle
            prefix="your logo"
            title="INTENSIFIES"
            variant="glow"
            fontClass="font-impact"
          />
        </Section>

        <Section
          name="<ImageDropZone />"
          desc="Drag & drop, paste, or click to upload. Composes around your canvas."
        >
          <div className="flex justify-center">
            <ImageDropZone
              onFile={handleFile}
              className={bg === "transparent" ? "bg-checker" : ""}
              style={{
                width: 320,
                height: 240,
                backgroundColor: bg === "transparent" ? undefined : bg,
              }}
            >
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              ) : undefined}
            </ImageDropZone>
          </div>
        </Section>

        <Section
          name="<ColorSwatchPicker />"
          desc="Background color row with a transparent (checker) swatch."
        >
          <ColorSwatchPicker value={bg} onChange={setBg} label="Background" />
        </Section>

        <Section
          name="<HowItWorks />"
          desc="The standard SEO-friendly explainer block at the bottom of meme pages."
        >
          <HowItWorks
            paragraphs={[
              "Upload any image, tweak it in the canvas, then export.",
              "Everything happens in your browser — no uploads, no watermarks, no sign-up.",
            ]}
          />
        </Section>

        <Section
          name="memeHead() helper"
          desc="One-line SEO/OG/JSON-LD setup for meme generator routes. See src/lib/meme-seo.ts."
        >
          <pre className="text-xs bg-muted p-4 rounded-md overflow-x-auto">
{`head: () => memeHead({
  title: "Your Logo Intensifies",
  description: "Drop a logo, get a shake GIF.",
  url: "https://yourlogointensifies.lovable.app/",
  appName: "Your Logo Intensifies",
})`}
          </pre>
        </Section>
      </main>

      <footer className="mt-12 text-xs text-muted-foreground text-center max-w-prose">
        Tag this project on a new meme generator to import these components and
        follow the same SEO + UX patterns. See <code>.lovable/rules/</code> for
        the playbook.
      </footer>
    </div>
  );
}

function Section({
  name,
  desc,
  children,
}: {
  name: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-border rounded-lg p-6 bg-card">
      <h2 className="font-mono text-sm font-semibold text-foreground">{name}</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-4">{desc}</p>
      {children}
    </section>
  );
}
