import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load .env, .env.development, .env.production, etc.
  const env = loadEnv(mode, process.cwd(), '');

  // Prefer Vite-style var; fall back to API_BASE if you set that on the host.
  const apiBase =
    env.VITE_API_BASE_URL ||
    env.API_BASE ||
    '';

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // <-- Enable @ alias
      },
    },

    // ⬇️ Make a global constant available at build time.
    // Any occurrence of `API_BASE` in your client code will be replaced with this string.
    define: {
      API_BASE: JSON.stringify(apiBase), // e.g. "https://barter-adverts-backend.onrender.com"
      // (optional) also expose an import.meta.env fallback so you can migrate gradually:
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBase),
    },

    optimizeDeps: {
      exclude: ['lucide-react'],
    },

    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      // If you prefer same-origin /api in dev, uncomment:
      // proxy: {
      //   '/api': { target: 'http://localhost:5000', changeOrigin: true },
      // },
    },
  };
});
