// import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';
import path from 'path';

const libName = 'Eagle';
const bundlePrefix = 'index';

// 多入口
const entry = {
  'web-sdk': path.resolve(__dirname, './packages/web-sdk/index.ts'),
  'mp-sdk': path.resolve(__dirname, './packages/mp-sdk/index.ts'),
};

export default defineConfig({
  plugins: [
    // typescript({
    //   target: 'es5',
    //   include: ['src/**/*.ts'],
    //   esModuleInterop: true,
    //   module: 'esnext',
    // }),
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    minify: !process.env.dev,
    lib: {
      entry,
      name: libName,
      formats: ['cjs', 'es'],
      fileName: (format, entryName) => {
        console.log('entryName', entryName);
        if (format === 'umd') {
          return `${entryName}/${bundlePrefix}.min.js`;
        }
        return `${entryName}/${bundlePrefix}.${format}.js`;
      },
    },
    rollupOptions: {
      input: entry,
      output: {
        exports: 'auto',
      },
    },
  },
  server: {
    host: '0.0.0.0',
  },
});
