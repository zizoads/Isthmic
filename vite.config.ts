
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Base set to '/' for AI Studio preview compatibility
  base: '/',
  plugins: [react()],
  define: {
    'process.env': {
      GEMINI_API_KEY: JSON.stringify(process.env.GEMINI_API_KEY),
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['recharts', 'motion', 'lucide-react'],
          'three-vendor': ['three'],
          'firebase-vendor': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
  }
});
