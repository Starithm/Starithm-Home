import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/novatrace/' : '/',
  css: {
    postcss: './postcss.config.js',
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'novatrace-assets/[name]-[hash][extname]',
        chunkFileNames: 'novatrace-assets/[name]-[hash].js',
        entryFileNames: 'novatrace-assets/[name]-[hash].js'
      }
    }
  },
});
