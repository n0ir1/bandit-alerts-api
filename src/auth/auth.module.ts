import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GraphqlAuthGuard } from './guards/graphqlAuth.guard';
import { AuthResolvers } from './auth.resolver';
import { AuthGuard } from './guards/auth.guard';

@Module({
  providers: [
    AuthService,
    JwtStrategy,
    GraphqlAuthGuard,
    AuthResolvers,
    AuthGuard,
  ],
  imports: [UserModule],
})
export class AuthModule {}
