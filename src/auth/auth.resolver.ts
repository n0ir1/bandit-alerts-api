import { Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';

@Resolver('Auth')
export class AuthResolvers {
  constructor(private readonly authService: AuthService) {}

  @Query('login')
  async login(obj, args, ctx) {
    const { username, password } = args;
    const user = await this.authService.logIn(username, password);
    const token = await this.authService.createToken(user.userId);

    return { token };
  }

  @Mutation('signup')
  async signup(obj, { username, password }) {
    const token = await this.authService.signUp({
      username,
      password,
    });
    return { token };
  }
}
