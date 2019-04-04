import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { TokensService, JwtPayload } from '../tokens.service';

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

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.tokensService.verify(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    return done(null, user, payload.iat);
  }
}
