interface BluetoothConfig {
  serial: Serial;
  speed?: number;
  lineEnding?: string;
}

type DataCallback = (data: string) => unknown;
type ErrorCallback = (data: Error) => unknown;

interface Listener {
  onData: DataCallback;
  onError: ErrorCallback;
}

// const DEFAULT_LINE_ENDING: string = '\r\n';

export class Bluetooth {
  private readonly serial: Serial;
  private readonly lineEnding: string | undefined;
  private readonly dataCallback: DataCallback | undefined;
  private readonly errorCallback: ErrorCallback | undefined;

  private listeners: Partial<Listener>[] = [];

  constructor({ serial, speed = 9600, lineEnding }: BluetoothConfig) {
    this.serial = serial;
    this.lineEnding = lineEnding;

    this.serial.setup(speed, {});

    this.subscribeOnData();
    this.subscribeOnErrors();
  }

  public command(command: string): void {
    this.println(command);
  }

  public subscribe(listener: Partial<Listener>): () => void {
    this.listeners.push(listener);

    return () => this.unsubscribe(listener);
  }

  public unsubscribe(listener: Partial<Listener>): void {
    this.listeners = this.listeners.filter(
      (item: Partial<Listener>) => item !== listener
    );
  }

  private println(data: string): void {
    typeof this.lineEnding === 'string'
      ? this.print(data + this.lineEnding)
      : this.serial.println(data);
  }

  private print(data: string): void {
    this.serial.print(data);
  }

  private subscribeOnData(): void {
    this.serial.on('data', (data: string) => {
      this.dataCallback?.(data);
    });
  }

  private subscribeOnErrors(): void {
    this.serial.on('parity', () => {
      this.errorCallback?.(new Error('[Bluetooth] parity'));
    });

    this.serial.on('framing', () => {
      this.errorCallback?.(new Error('[Bluetooth] framing'));
    });
  }
}
