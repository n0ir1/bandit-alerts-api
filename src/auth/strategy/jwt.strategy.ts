import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokensService } from '../tokens.service';

import { config } from '../../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly tokensService: TokensService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('accessToken'),
      ]),
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload, done) {
    try {
      const user = await this.tokensService.verify(payload);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
