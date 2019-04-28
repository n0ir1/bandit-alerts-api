import * as Pbkdf2 from '@phc/pbkdf2';
import { Module, Global } from '@nestjs/common';
import { pubSubProvider } from './providers/pubSub.provider';
import { HashModule } from '../hash/hash.module';

@Global()
@Module({
  imports: [
    HashModule.forRoot({
      name: 'pbkdf2',
      algorithm: Pbkdf2,
    }),
  ],
  providers: [pubSubProvider],
  exports: [HashModule, pubSubProvider],
})
export class SharedModule {}
