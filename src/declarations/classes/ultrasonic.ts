import { PinMode } from '../enums/pin-mode.enum';
import { Unit } from '../enums/unit.enum';

// 4 meters in millimeters
const MAX_DISTANCE: number = 4 * 1000;
const SOUND_SPEED: number = 340;

const MAX_ROUNDTRIP_MS: number = (MAX_DISTANCE * 2) / SOUND_SPEED;

interface SetWatchResult {
  state: boolean;
  time: number;
  lastTime: number;
}

interface UltrasonicConfig {
  trigPin: Pin;
  echoPin: Pin;
}

export class Ultrasonic {
  private readonly trigPin: Pin;
  private readonly echoPin: Pin;

  private startTime: number | undefined;
  private riseWatchId: string | undefined;
  private timeoutId: NodeJS.Timeout | undefined;
  private fallWatchId: string | undefined;

  constructor({ trigPin, echoPin }: UltrasonicConfig) {
    this.trigPin = trigPin;
    this.echoPin = echoPin;

    this.trigPin.mode(PinMode.Output);
    this.echoPin.mode(PinMode.Input);
  }

  public ping(unit: Unit): Promise<number> {
    if (this.isBusy()) {
      return Promise.reject(new Error('[Ultrasonic] sensor is busy'));
    }

    return new Promise(
      (resolve: (value: number) => void, reject: (error: Error) => void) => {
        this.getDistance(unit).then((distance: number) => resolve(distance));

        this.waitForErrors().then((error: Error) => reject(error));

        digitalPulse(this.trigPin, true, 0.01);
      }
    );
  }

  private isBusy(): boolean {
    return this.timeoutId !== undefined;
  }

  private getDistance(unit: Unit): Promise<number> {
    return new Promise((resolve: (value: number) => void) => {
      this.riseWatchId = setWatch(
        (riseWatchResult: SetWatchResult) => {
          this.riseWatchId = undefined;
          this.startTime = riseWatchResult.time;

          this.fallWatchId = setWatch(
            (fallWatchResult: SetWatchResult) => {
              this.fallWatchId = undefined;

              this.cancelWaitingForErrors();

              const roundtripTime: number =
                fallWatchResult.time - (this.startTime ?? 0);

              this.startTime = undefined;

              resolve(convertSecondsToUnit(roundtripTime, unit));
            },
            this.echoPin,
            { edge: 'falling' }
          );
        },
        this.echoPin,
        { edge: 'rising' }
      );
    });
  }

  private waitForErrors(): Promise<Error> {
    return new Promise((resolve: (error: Error) => void) => {
      this.timeoutId = setTimeout(() => {
        this.timeoutId = undefined;

        if (this.riseWatchId !== undefined) {
          clearWatch(this.riseWatchId);
          this.riseWatchId = undefined;

          resolve(new Error('[Ultrasonic] wrong connection'));
          return;
        }

        this.startTime = undefined;

        clearWatch(this.fallWatchId);
        this.fallWatchId = undefined;

        resolve(new Error('[Ultrasonic] timeout'));
      }, MAX_ROUNDTRIP_MS);
    });
  }

  private cancelWaitingForErrors(): void {
    clearTimeout(this.timeoutId);
    this.timeoutId = undefined;
  }
}

function convertSecondsToUnit(seconds: number, unit: Unit): number {
  switch (unit) {
    case Unit.Meter:
      return (seconds / 2) * SOUND_SPEED;
    case Unit.Centimeter:
      return (seconds / 2) * SOUND_SPEED * 100;
    case Unit.Millimeter:
      return (seconds / 2) * SOUND_SPEED * 1000;
    case Unit.Second:
      return seconds;
    case Unit.Millisecond:
      return seconds * 1000;
    case Unit.Microsecond:
      return seconds * 1000000;
    default:
      return seconds;
  }
}
