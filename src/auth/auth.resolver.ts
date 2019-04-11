import { Mutation, Resolver, Query, Context, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { TokensService } from './tokens.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/graphqlAuth.guard';
import { Tokens } from './models/tokens';
import { LoginInput } from './dto/login-input';
import { TokensArgs } from './dto/tokens.args';
import { SignupInput } from './dto/signup-input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/models/user';

@Resolver(of => Tokens)
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Query(returns => Tokens)
  async login(@Args('loginInputData') loginInputData: LoginInput) {
    const user = await this.authService.logIn(loginInputData);
    const {
      accessToken,
      refreshToken,
    } = await this.tokensService.generateTokens(user.userId);

    return { accessToken, refreshToken };
  }

  @Mutation(returns => Tokens)
  async signup(@Args('signupInputData') signupInputData: SignupInput) {
    const { username, password } = signupInputData;
    const { accessToken, refreshToken } = await this.authService.signUp({
      username,
      password,
    });
    return { accessToken, refreshToken };
  }

  @Query(returns => Tokens)
  async tokens(@Args() args: TokensArgs) {
    const { refreshToken } = args;

    return await this.tokensService.getPairTokensFromRefreshToken(refreshToken);
  }

  @Mutation(returns => Boolean)
  @UseGuards(GraphqlAuthGuard)
  async logout(@CurrentUser() user: User) {
    await this.tokensService.removeTokenByUserId(user.userId);
  }
}
