import * as esbuild from 'esbuild';
import { buildConfig } from '../build.config';

const serve = async (): Promise<void> => {
  const context: esbuild.BuildContext = await esbuild.context(buildConfig);
  await context.watch();
};

serve();
