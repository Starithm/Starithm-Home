// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig({
//   plugins: [
//     react(),
//     tailwindcss(),
//   ],
//   resolve: {
//     alias: {
//       '@': './src',
//       '@shared': './shared',
//       '@microfrontends': './microfrontends',
//     },
//   },
//   server: {
//     port: 3000,
//     open: true,
//     host: true,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5004',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   },
//   build: {
//     rollupOptions: {
//       output: {
//         manualChunks: {
//           vendor: ['react', 'react-dom'],
//           microfrontends: [
//             './src/microfrontends/HomeMicrofrontend.tsx',
//             './src/microfrontends/BlogMicrofrontend.tsx',
//             './src/microfrontends/NovaTraceMicrofrontend.tsx'
//           ]
//         }
//       }
//     }
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom', 'react-router-dom']
//   }
// })
// vite.config.ts (repo root)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { crossAliases, buildMfeAliases } from "./vite.aliases";

const rootDir = path.resolve(fileURLToPath(new URL(".", import.meta.url)));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      ...crossAliases,
      ...buildMfeAliases(["home", "novatrace", "blog"]),

    },
    dedupe: ["react", "react-dom", "react-router-dom", "@tanstack/react-query", "styled-components"],
  },
  server: { port: 3000, open: true, host: true, proxy: { "/api": { target: "http://localhost:5004", changeOrigin: true, secure: false } } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          microfrontends: [
            "./src/microfrontends/HomeMicrofrontend.tsx",
            "./src/microfrontends/BlogMicrofrontend.tsx",
            "./src/microfrontends/NovaTraceMicrofrontend.tsx",
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom", "styled-components"],
  },
});
