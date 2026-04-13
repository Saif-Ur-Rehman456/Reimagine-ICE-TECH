import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],

    build: {
      target: 'ES2020',
      minify: 'esbuild',

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('gsap')) return 'vendor-gsap';
              if (id.includes('lenis')) return 'vendor-lenis';
              if (id.includes('react') || id.includes('scheduler')) return 'vendor-react';
              if (id.includes('split-type')) return 'vendor-split-type';
              return 'vendor-other';
            }
          },
        },
      },

      // ── STEP 1: Tree-shake unused exports ──
      cssCodeSplit: true,
      sourcemap: !isProduction,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,

      // ── PERFORMANCE: Preload directives ──
      // Vite automatically emits <link rel="modulepreload"> for every
      // JS chunk that is eagerly imported. This warms up the network
      // for the lazy chunks just before they are needed.
    },

    esbuild: {
      // Strip console.* and debugger in production builds
      drop: isProduction ? ['console', 'debugger'] : [],
      // ── STEP 1: Remove JS comments in production (small savings, zero risk) ──
      legalComments: isProduction ? 'none' : 'inline',
    },

    optimizeDeps: {
      // Pre-bundle these for dev (avoids cascading 304 requests on cold start)
      include: ['react', 'react-dom', 'gsap', 'lenis', 'split-type'],
      exclude: ['locomotive-scroll'],
    },

    server: {
      watch: {
        usePolling: true,
        interval: 100,
        include: ['src/**', 'tailwind.config.js', 'postcss.config.js'],
      },
      hmr: {
        protocol: 'ws',
        host: 'localhost',
        port: 5173,
      },
      middlewareMode: false,
    },
  };
});
