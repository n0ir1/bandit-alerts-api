import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { config } from '../../config';
import { Tokens as TokensEntity } from './tokens.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import * as ms from 'ms';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(TokensEntity)
    private readonly tokensRepository: Repository<TokensEntity>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async findOne(findOptions?: FindOneOptions) {
    return this.tokensRepository.findOne(findOptions);
  }

  async find(findOptions?: FindManyOptions<TokensEntity>) {
    return this.tokensRepository.find(findOptions);
  }

  async generateTokens(userId) {
    const user = { userId };

    const accessToken = await jwt.sign(user, config.jwt.secret, {
      expiresIn: config.jwt.accessTokenExpires,
    });

    const refreshToken = await jwt.sign(user, config.jwt.secret, {
      expiresIn: config.jwt.refreshTokenExpires,
    });

    const tokens = new TokensEntity();
    tokens.accessToken = accessToken;
    tokens.refreshToken = refreshToken;
    tokens.userId = userId;
    await this.tokensRepository.save(tokens);

    return { accessToken, refreshToken };
  }

  async getAccessTokenFromRefreshToken(refreshToken) {
    const tokenData = await this.findOne({
      where: { refreshToken },
    });

    if (!tokenData) {
      throw new Error('Refresh token not found');
    }

    const now = new Date().getTime();
    const createdAt = new Date(tokenData.createdAt).getTime();

    if (now - createdAt < ms(config.jwt.refreshTokenExpires)) {
      await this.tokensRepository.delete({ id: tokenData.id });
      return await this.generateTokens(tokenData.userId);
    } else {
      await this.tokensRepository.delete({ id: tokenData.id });
      throw new Error('Refresh token expired');
    }
  }

  async removeTokenById(userId) {
    return await this.tokensRepository.delete({
      userId,
    });
  }

  async verify(payload) {
    const user = await this.userService.findOne({
      where: {
        userId: payload.userId,
      },
    });

    if (!user) {
      throw new Error('Invalid authorization');
    }

    return user;
  }
}
