import * as ms from 'ms';
import {
  Injectable,
  NotFoundException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository, FindManyOptions } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokensEntity } from './entities/tokens.entity';
import { JWT_OPTIONS } from './tokens.constants';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtOptions } from './interfaces/jwt-options.interface';
import { Tokens } from '../auth/models/tokens';

@Injectable()
export class TokensService {
  constructor(
    @Inject(JWT_OPTIONS) private readonly jwtOptions: JwtOptions,
    private readonly jwtService: JwtService,
    @InjectRepository(TokensEntity)
    private readonly tokensRepository: Repository<TokensEntity>,
  ) {}

  async findOne(conditions: Partial<TokensEntity>): Promise<TokensEntity> {
    const token = await this.tokensRepository.findOne(conditions);
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return token;
  }

  async find(
    findOptions?: FindManyOptions<TokensEntity>,
  ): Promise<TokensEntity[]> {
    return this.tokensRepository.find(findOptions);
  }

  async generateTokens(userId: string): Promise<Tokens> {
    const { accessTokenExpires, refreshTokenExpires } = this.jwtOptions;

    const user: JwtPayload = { userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.sign(user, {
        expiresIn: accessTokenExpires,
      }),
      this.jwtService.sign(user, {
        expiresIn: refreshTokenExpires,
      }),
    ]);

    const tokens = new TokensEntity();
    tokens.refreshToken = refreshToken;
    tokens.userId = userId;
    await this.tokensRepository.save(tokens);

    return { accessToken, refreshToken };
  }

  async getPairTokensFromRefreshToken(refreshToken: string): Promise<Tokens> {
    const { refreshTokenExpires } = this.jwtOptions;
    const tokenData = await this.findOne({ refreshToken });

    const now = new Date().getTime();
    const createdAt = new Date(tokenData.createdAt).getTime();
    const diff = now - createdAt;
    const isValidRefreshToken = diff < ms(refreshTokenExpires);

    await this.removeToken(tokenData.id);

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return await this.generateTokens(tokenData.userId);
  }

  async removeToken(id: string) {
    return await this.tokensRepository.delete({ id });
  }
}
