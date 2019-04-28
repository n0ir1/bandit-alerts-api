import { Injectable, Inject } from '@nestjs/common';
import { UPASH } from './hash.constants';
import { HashOptions, Upash } from './interfaces/hash.interface';

@Injectable()
export class HashService {
  constructor(@Inject(UPASH) private readonly upash: Upash) {}

  async hashPassword(
    password: string,
    hashOptions?: HashOptions,
  ): Promise<string> {
    return await this.upash.hash(password, hashOptions);
  }

  async comparePassword(hashstr: string, password: string): Promise<boolean> {
    return await this.upash.verify(hashstr, password);
  }
}
