import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GraphqlAuthGuard } from './guards/graphqlAuth.guard';
import { AuthResolvers } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { TokensService } from './tokens.service';
import { Tokens } from './tokens.entity';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([User, Tokens])],
  providers: [
    AuthService,
    TokensService,
    JwtStrategy,
    GraphqlAuthGuard,
    AuthResolvers,
  ],
})
export class AuthModule {}
