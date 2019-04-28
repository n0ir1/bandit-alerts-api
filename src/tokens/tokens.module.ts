import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './tokens.service';
import { tokensProviders } from './tokens.providers';
import { JwtOptions } from './interfaces/jwt-options.interface';
import { JWT_OPTIONS } from './tokens.constants';
import { TokensEntity } from './entities/tokens.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forFeature([TokensEntity]),
    JwtModule.registerAsync({
      imports: [TokensModule],
      useFactory: async (jwtOptions: JwtOptions) => ({
        secretOrPrivateKey: jwtOptions.secret,
      }),
      inject: [JWT_OPTIONS],
    }),
  ],
  providers: [TokensService, ...tokensProviders],
  exports: [TokensService, ...tokensProviders],
})
export class TokensModule {}
