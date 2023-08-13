import 'ts-polyfill/lib/es2015-collection';
import { Bluetooth } from './declarations/classes/bluetooth';

// const ultrasonic: Ultrasonic = new Ultrasonic({ trigPin: P12, echoPin: P11 });

// ultrasonic.ping(Unit.Centimeter).then((distance: number) => {
//   print(`distance ${distance}`);
// });

const bluetooth: Bluetooth = new Bluetooth({ serial: Serial1 });

bluetooth.subscribe({
  onData: (data: string) => {
    print(`>> data: ${data}`);
  },
  onError: (error: Error) => {
    print(`>> error: ${error.message}`);
  },
});

bluetooth.command('HELLO WORLD!');

save();
