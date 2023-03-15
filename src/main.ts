import { Ultrasonic } from './declarations/classes/ultrasonic';
import { Unit } from './declarations/enums/unit.enum';

const ultrasonic = new Ultrasonic({ trigPin: P12, echoPin: P11 });

ultrasonic.ping(Unit.Centimeter).then((distance: number) => {
  print(`distance ${distance}`);
});
