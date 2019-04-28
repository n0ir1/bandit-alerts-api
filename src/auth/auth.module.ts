import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolvers } from './auth.resolver';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from '../user/user.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [UserModule, TokensModule],
  providers: [AuthService, AuthResolvers, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
