import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';

export default defineConfig({
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      plugins: [esbuildCommonjs()],
    },
  },
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      }
    }),
  ],
  server: {
    watch: {
      usePolling: true,
    },
    strictPort: true,
  },
  build: {
    minify: 'esbuild',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1600,
    manifest: true,
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'JovencioDatatableVue',
      fileName: (format) => `jovencio-datatable-vue.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  }
});