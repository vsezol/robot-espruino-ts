import { BuildOptions } from 'esbuild';
import es5Plugin from 'esbuild-plugin-es5';
import * as path from 'path';

export const buildConfig: BuildOptions = {
  entryPoints: ['./src/main.ts'],
  bundle: true,
  treeShaking: true,
  minify: false,
  tsconfig: 'tsconfig.json',
  outfile: 'dist/main.js',
  target: 'es5',
  plugins: [es5Plugin()],
  alias: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '@swc/helpers': path.dirname(require.resolve('@swc/helpers/package.json')),
  },
};
