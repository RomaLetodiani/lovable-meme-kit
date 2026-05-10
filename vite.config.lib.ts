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
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/routes/**", "src/components/ui/**", "src/router.tsx", "src/server.ts", "src/start.ts", "src/routeTree.gen.ts", "src/hooks/**", "src/lib/error-capture.ts", "src/lib/error-page.ts"],
      outDir: "dist",
      rollupTypes: true,
      insertTypesEntry: true,
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
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "styles.css";
          }
          return assetInfo.name || "[name][extname]";
        },
      },
    },
    cssCodeSplit: false,
  },
});
