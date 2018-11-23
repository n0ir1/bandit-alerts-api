import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GraphqlAuthGuard } from './guard/graphqlAuth.guard';
import { AuthResolvers } from './auth.resolver';

@Module({
  providers: [AuthService, JwtStrategy, GraphqlAuthGuard, AuthResolvers],
  imports: [UserModule],
})
export class AuthModule {}
