import { ChildProcess, fork } from 'child_process';
import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { appConfig } from '../app.config';
import { buildConfig } from '../build.config';

const outputFilePath: string = path.join(
  appConfig.outputDir,
  appConfig.outputFileName
);

const build = async (): Promise<void> => {
  await esbuild.build(buildConfig);
};

const load = (): Promise<void> =>
  new Promise((resolve: () => void, reject: () => void) => {
    if (!fs.existsSync(outputFilePath)) {
      reject();
    }

    const buildProcess: ChildProcess = fork(
      require.resolve('espruino/bin/espruino-cli'),
      [
        '--board',
        appConfig.boardName,
        '-b',
        appConfig.portSpeed.toString(),
        '--port',
        appConfig.port,
        '-o',
        appConfig.outputFileName,
        appConfig.outputFileName,
      ],
      { cwd: appConfig.outputDir }
    );

    buildProcess.on('close', () => resolve());
  });

(async () => {
  await build();
  await load();
})();
