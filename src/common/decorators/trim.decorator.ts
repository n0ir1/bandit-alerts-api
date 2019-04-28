import { TRIM_PROPERTY } from '../../constants';

export function Trim(): PropertyDecorator {
  return function(target: Object, propertyName: string | symbol) {
    const previousValue = Reflect.getMetadata(TRIM_PROPERTY, target) || [];
    const value = [...previousValue, propertyName];

    Reflect.defineMetadata(TRIM_PROPERTY, value, target);
  };
}
