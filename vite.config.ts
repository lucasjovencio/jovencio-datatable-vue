import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { chunkSplitPlugin } from 'vite-plugin-chunk-split';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      }
    }),
    // chunkSplitPlugin(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.ts'),
      name: 'JovencioDatatableVue',
      fileName: (format) => `jovencio-datatable-vue.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue'],
      rollupOptions: {
        output: {
          inlineDynamicImports: false,
          globals: {
            vue: 'Vue',
          },
        },
        external: ['Vue'],
      },
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