import { Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from './guards/graphqlAuth.guard';

@Resolver('Auth')
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Query('login')
  async login(obj, args, ctx) {
    const { username, password } = args;
    const user = await this.authService.logIn(username, password);
    const {
      accessToken,
      refreshToken,
    } = await this.tokensService.generateTokens(user.userId);

    return { accessToken, refreshToken };
  }

  @Mutation('signup')
  async signup(obj, { username, password }) {
    const { accessToken, refreshToken } = await this.authService.signUp({
      username,
      password,
    });
    return { accessToken, refreshToken };
  }

  @Query()
  async tokens(root, args, ctx) {
    const { refreshToken } = args;

    return await this.tokensService.getAccessTokenFromRefreshToken(
      refreshToken,
    );
  }

  @Mutation('logout')
  @UseGuards(GraphqlAuthGuard)
  async logout(obj, args, ctx) {
    await this.tokensService.removeTokenById(ctx.req.user.userId);
  }
}
