import * as upash from 'upash';
import {
  UpashOptions,
  UpashOptionsAsync,
  UpashOptionsFactory,
} from './interfaces/hash.interface';
import { UPASH_OPTIONS, UPASH } from './hash.constants';
import { Provider } from '@nestjs/common';

export const upashProvider = {
  provide: UPASH,
  useFactory: (upashOptions: UpashOptions) => {
    const { name, algorithm } = upashOptions;
    upash.install(name, algorithm);

    return upash;
  },
  inject: [UPASH_OPTIONS],
};

export function createUpashOptionsProvider(options: UpashOptions): any[] {
  return [{ provide: UPASH_OPTIONS, useValue: options || {} }];
}

export function createAsyncProviders(options: UpashOptionsAsync): Provider[] {
  if (options.useExisting || options.useFactory) {
    return [createAsyncOptionsProvider(options)];
  }
  return [
    createAsyncOptionsProvider(options),
    {
      provide: options.useClass,
      useClass: options.useClass,
    },
  ];
}

export function createAsyncOptionsProvider(
  options: UpashOptionsAsync,
): Provider {
  if (options.useFactory) {
    return {
      provide: UPASH_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }
  return {
    provide: UPASH_OPTIONS,
    useFactory: async (optionsFactory: UpashOptionsFactory) =>
      await optionsFactory.createUpashOptions(),
    inject: [options.useExisting || options.useClass],
  };
}
