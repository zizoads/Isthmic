import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
// Fix: Import fileURLToPath to support directory resolution in ESM
import { fileURLToPath } from 'url';

// Fix: __dirname is not available in ESM context; resolve the current directory path manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/'],
    },
  },
  resolve: {
    alias: {
      // Fix: Use the manually resolved __dirname for the alias path
      '@': path.resolve(__dirname, './'),
    },
  },
});