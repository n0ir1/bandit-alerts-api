import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Tokens } from './models/tokens';
import { LoginInput } from './dto/login-input';
import { TokensArgs } from './dto/tokens.args';
import { SignupInput } from './dto/signup-input';
import { GraphqlAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { TokensService } from '../tokens/tokens.service';
import { User } from '../user/models/user';

@Resolver(of => Tokens)
export class AuthResolvers {
  constructor(
    private readonly authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Query(returns => Tokens)
  async login(@Args('loginInputData') loginInputData: LoginInput) {
    return await this.authService.logIn(loginInputData);
  }

  @Mutation(returns => Tokens)
  async signup(@Args('signupInputData') signupInputData: SignupInput) {
    return await this.authService.signUp(signupInputData);
  }

  @Query(returns => Tokens)
  async tokens(@Args() { refreshToken }: TokensArgs) {
    return await this.tokensService.getPairTokensFromRefreshToken(refreshToken);
  }

  @Mutation(returns => Boolean)
  @UseGuards(GraphqlAuthGuard)
  async logout(@CurrentUser() { id }: User) {
    await this.tokensService.removeToken(id);
  }
}
