import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { uglify } from 'rollup-plugin-uglify';
import path from 'path';

const outDir = path.resolve(__dirname, './dist');
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [dts()],
  build: {
    outDir,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'eyedropper-polyfill',
    },
    minify: 'esbuild',
    sourcemap: !isProduction,
    rollupOptions: {
      plugins: [uglify()],
    },
  },
});
