import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isObject } from '@nestjs/common/utils/shared.utils';
import { plainToClass } from 'class-transformer';
import { TRIM_PROPERTY } from '../../constants';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value, metadata: ArgumentMetadata) {
    const { metatype } = metadata;

    if (!metatype || !isObject(value)) {
      return value;
    }

    const object = plainToClass(metatype, value);

    const valuesMetadata = Reflect.getMetadata(TRIM_PROPERTY, object);

    if (!valuesMetadata) {
      return value;
    }

    for (const key of valuesMetadata) {
      if (typeof key !== 'string') {
        throw new Error(`Property ${key} not a string`);
      }

      if (object.hasOwnProperty(key)) {
        object[key] = object[key].trim();
      }
    }

    return object;
  }
}
