import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'JovencioDatatableVue',
      fileName: (format) => `jovencio-datatable-vue.${format}.js`
    },
    rollupOptions: {
      // Para evitar conflitos de dependências
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
});