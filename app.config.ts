interface AppConfig {
  entryPointPath: string;
  outputDir: string;
  outputFileName: string;
  boardName: string;
  portSpeed: number;
  port: string;
}

export const appConfig: AppConfig = {
  entryPointPath: './src/main.ts',
  outputFileName: 'main.js',
  outputDir: './dist',
  boardName: 'ESP32',
  portSpeed: 9600,
  port: '/dev/tty.usbmodem00000000001A1',
};
