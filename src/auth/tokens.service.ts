import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as ms from 'ms';
import { Tokens as TokensEntity } from './tokens.entity';
import { Tokens } from './models/tokens';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { config } from '../../config';

export interface JwtPayload {
  userId: string;
  iat?: number;
}

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokensEntity)
    private readonly tokensRepository: Repository<TokensEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async findOne(findOptions?: FindOneOptions) {
    return this.tokensRepository.findOne(findOptions);
  }

  async find(findOptions?: FindManyOptions<TokensEntity>) {
    return this.tokensRepository.find(findOptions);
  }

  async generateTokens(userId: string): Promise<Tokens> {
    const user: JwtPayload = { userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(user, {
        expiresIn: config.jwt.accessTokenExpires,
      }),
      this.jwtService.sign(user, {
        expiresIn: config.jwt.refreshTokenExpires,
      }),
    ]);

    const tokens = new TokensEntity();
    tokens.refreshToken = refreshToken;
    tokens.userId = userId;
    await this.tokensRepository.save(tokens);

    return { accessToken, refreshToken };
  }

  async getPairTokensFromRefreshToken(refreshToken: string): Promise<Tokens> {
    const tokenData = await this.findOne({
      where: { refreshToken },
    });

    if (!tokenData) {
      throw new Error('Refresh token not found');
    }

    const now = new Date().getTime();
    const createdAt = new Date(tokenData.createdAt).getTime();

    await this.removeTokenByUserId(tokenData.id);

    if (!(now - createdAt < ms(config.jwt.refreshTokenExpires))) {
      throw new Error('Refresh token expired');
    }

    return await this.generateTokens(tokenData.userId);
  }

  async removeTokenByUserId(userId: string) {
    return await this.tokensRepository.delete({ userId });
  }

  async verify({ userId }: JwtPayload): Promise<User> {
    return await this.userService.findByUserId(userId);
  }
}
