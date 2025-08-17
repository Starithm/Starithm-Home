import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/home/' : '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'home-assets/[name]-[hash][extname]',
        chunkFileNames: 'home-assets/[name]-[hash].js',
        entryFileNames: 'home-assets/[name]-[hash].js'
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
