import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
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
