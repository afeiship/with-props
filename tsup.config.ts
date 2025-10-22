import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*.tsx'],
  format: ['cjs', 'esm' /*'iife' */],
  splitting: true,
  cjsInterop: true,
  // globalName: 'i18nHelper',
  external: ['react'],
  clean: true,
  dts: true,
  sourcemap: true,
  // onSuccess: 'tsc --project tsconfig.json --emitDeclarationOnly --declaration --outDir dist',
  outExtension({ format }) {
    return {
      js: `.${format}.js`,
    };
  },
});
