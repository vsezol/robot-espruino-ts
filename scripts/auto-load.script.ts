/* eslint-disable no-console */
import { ChildProcess, fork } from 'child_process';
import { appConfig } from '../app.config';

const autoLoadProcess: ChildProcess = fork(
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
    '-w',
    appConfig.outputFileName,
  ],
  { cwd: appConfig.outputDir }
);

autoLoadProcess.on('close', () => {
  console.info('[autoLoad] closed');
});

autoLoadProcess.on('error', (error: Error) => {
  console.error('[autoLoad] error', error);
});
