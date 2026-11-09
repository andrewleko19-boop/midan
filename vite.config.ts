import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// GitHub Pages project sites live under /<repo>/. CI passes BASE_PATH=/<repo>/ (see .github/workflows/deploy.yml).
// Locally it stays '/'.
const base = (process.env.BASE_PATH ?? '/').replace(/\/?$/, '/');

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    sourcemap: false,
    // The preload polyfill uses fetch(); native modulepreload is enough and keeps the bundle network-free.
    modulePreload: { polyfill: false },
  },
  preview: { port: 4173, strictPort: true },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
