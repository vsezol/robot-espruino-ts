import * as esbuild from 'esbuild';

export const buildConfig: esbuild.BuildOptions = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  treeShaking: true,
  minify: true,
  tsconfig: 'tsconfig.json',
  outfile: 'dist/main.js',
  plugins: [],
};
