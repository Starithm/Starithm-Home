import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/blog/' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  server: {
    port: 5175,
    host: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'blog-assets/[name]-[hash][extname]',
        chunkFileNames: 'blog-assets/[name]-[hash].js',
        entryFileNames: 'blog-assets/[name]-[hash].js'
      }
    }
  }
})
