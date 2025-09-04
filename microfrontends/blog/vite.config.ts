import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { crossAliases } from "../../vite.aliases.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: process.env.NODE_ENV === 'production' ? '/blog/' : '/',
  resolve: {
    alias: {
      ...crossAliases,
      "@blog": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5175,
    host: true
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'BlogMicrofrontend',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
      output: {
        assetFileNames: 'blog-assets/[name]-[hash][extname]',
        chunkFileNames: 'blog-assets/[name]-[hash].js',
        entryFileNames: 'blog-assets/[name]-[hash].js'
      }
    }
  }
})
