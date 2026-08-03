import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Build target: es2020 keeps the output runnable on mid-range Android devices
// running older Chrome versions (and modern iPhones), while staying compact.
const BUILD_TARGET = 'es2020';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: BUILD_TARGET,
      cssTarget: BUILD_TARGET,
      minify: 'esbuild',
      cssMinify: 'esbuild',
      sourcemap: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 600,
      modulePreload: { polyfill: false },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom') || id.includes('node_modules/motion-utils')) {
              return 'motion';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'icons';
            }
            return undefined;
          },
        },
      },
    },
    esbuild: {
      legalComments: 'none',
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
