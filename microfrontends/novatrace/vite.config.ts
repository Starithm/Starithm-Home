import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crossAliases } from "../../vite.aliases.ts";

const mfRoot = fileURLToPath(new URL(".", import.meta.url));
const rootNodeModules = path.resolve(mfRoot, "../../node_modules");

function aliasInspector() {
  return {
    name: "alias-inspector",
    configResolved(config) {
      // This prints after Vite merges all configs and plugins
      console.log("\n[alias-inspector] Final alias map:");
      for (const a of config.resolve.alias) {
        console.log(" •", a.find, "=>", a.replacement);
      }
      console.log();
    },
  };
}
function probe(id = "@novatrace/components/SystemStatus") {
  return {
    name: "probe",
    async buildStart() {
      const r = await this.resolve(id, undefined);
      console.log("[probe]", id, "->", r?.id ?? "NOT FOUND");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), aliasInspector(), probe()],
  base: process.env.NODE_ENV === "production" ? "/novatrace/" : "/",
  resolve: {
    alias: {
      "@tanstack/react-query": path.join(rootNodeModules, "@tanstack/react-query"),
      "@tanstack/query-core":  path.join(rootNodeModules, "@tanstack/query-core"),
      ...crossAliases,
      "@novatrace": path.resolve(mfRoot, "src"),
    },
    dedupe: ["react", "react-dom", "react-router-dom", "@tanstack/react-query"],
  },
  server: { port: 5174, host: true },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "novatrace-assets/[name]-[hash][extname]",
        chunkFileNames: "novatrace-assets/[name]-[hash].js",
        entryFileNames: "novatrace-assets/[name]-[hash].js",
      },
    },
  },
});