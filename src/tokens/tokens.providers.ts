import { JWT_OPTIONS } from './tokens.constants';
import { JwtOptions } from './interfaces/jwt-options.interface';

export const tokensProviders = [
  {
    provide: JWT_OPTIONS,
    useValue: {
      secret: 'secret',
      accessTokenExpires: '10m',
      refreshTokenExpires: '7d',
    } as JwtOptions,
  },
];
