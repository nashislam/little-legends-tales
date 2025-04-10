
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Add build configuration for proper caching headers
  build: {
    rollupOptions: {
      output: {
        // Add proper cache busting by including content hashes in file names
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',
      },
    },
  },
  // Generate headers file for deployment platforms that support it (like Netlify, Vercel)
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      // Apply hash-based URLs only for browser-rendered URLs
      if (hostType === 'js' || hostType === 'css') {
        return { relative: true };
      }
      return { relative: true };
    },
  },
}));
