import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { ACCESS_TOKEN, JWT_OPTIONS } from '../../tokens/tokens.constants';
import { JwtPayload } from '../../tokens/interfaces/jwt-payload.interface';
import { JwtOptions } from '../../tokens/interfaces/jwt-options.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(JWT_OPTIONS) jwtOptions: JwtOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter(ACCESS_TOKEN),
      ]),
      secretOrKey: jwtOptions.secret,
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.authService.validateUserPayload(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }

    return done(null, user, payload.iat);
  }
}
