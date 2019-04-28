import { Module, DynamicModule } from '@nestjs/common';
import { HashService } from './hash.service';
import { UpashOptions, UpashOptionsAsync } from './interfaces/hash.interface';
import {
  createUpashOptionsProvider,
  createAsyncProviders,
  upashProvider,
} from './hash.provider';

@Module({
  providers: [HashService, upashProvider],
  exports: [HashService, upashProvider],
})
export class HashModule {
  static forRoot(options: UpashOptions): DynamicModule {
    return {
      module: HashModule,
      providers: createUpashOptionsProvider(options),
    };
  }

  static forRootAsync(options: UpashOptionsAsync): DynamicModule {
    return {
      module: HashModule,
      imports: options.imports || [],
      providers: createAsyncProviders(options),
    };
  }
}
