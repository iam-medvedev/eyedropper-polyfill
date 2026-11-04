import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

const outDir = path.resolve(import.meta.dirname, './dist');
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: path.resolve(import.meta.dirname, './tsconfig.build.json'),
    }),
  ],
  build: {
    outDir,
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'eyedropper-polyfill',
    },
    sourcemap: !isProduction,
    rolldownOptions: {
      output: { minify: true, globals: { 'html2canvas-pro': 'html2canvas' } },
      external: ['html2canvas-pro'],
    },
  },
});
