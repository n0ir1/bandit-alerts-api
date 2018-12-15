import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { config } from '../../../config';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const auth = req.get('Authorization');
    if (auth) {
      const token = auth.replace('Bearer ', '');
      const { userId }: any = jwt.verify(token, config.jwt.secret);
      return !!userId;
    }
  }
}
