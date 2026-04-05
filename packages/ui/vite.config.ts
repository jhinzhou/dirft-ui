import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const currentDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    dts({
      tsconfigPath: resolve(currentDir, "tsconfig.json"),
      outDir: "dist"
    })
  ],
  build: {
    lib: {
      entry: resolve(currentDir, "src/index.ts"),
      name: "DriftUI",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
      cssFileName: "styles"
    },
    rollupOptions: {
      external: ["vue"]
    }
  }
});
