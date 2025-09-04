import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: process.env.NODE_ENV === 'production' ? '/home/' : '/',
  resolve: {
    alias: {
      "@home": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../../shared"),
    },
  },
  build: {
    // Library mode prevents Vite from requiring an index.html entry
    lib: {
      entry: path.resolve(__dirname, 'src/main.tsx'),
      name: 'HomeMicrofrontend',
      formats: ['es'],
      fileName: 'index',
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ['react', 'react-dom', 'styled-components'],
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
