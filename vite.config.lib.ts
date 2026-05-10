import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      entryRoot: "src",
      include: [
        "src/lib/index.ts",
        "src/lib/meme-seo.ts",
        "src/lib/utils.ts",
        "src/components/MemeTitle.tsx",
        "src/components/ImageDropZone.tsx",
        "src/components/ColorSwatchPicker.tsx",
        "src/components/HowItWorks.tsx",
      ],
      outDir: "dist",
      rollupTypes: true,
      tsconfigPath: "./tsconfig.json",
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "LovableMemeKit",
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: { react: "React", "react-dom": "ReactDOM" },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css" || assetInfo.name === "index.css") {
            return "styles.css";
          }
          return assetInfo.name || "[name][extname]";
        },
      },
    },
    cssCodeSplit: false,
  },
});
