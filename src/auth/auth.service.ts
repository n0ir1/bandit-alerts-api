import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Tokens } from './models/tokens';
import { SignupInput } from './dto/signup-input';
import { LoginInput } from './dto/login-input';
import { UserService } from '../user/user.service';
import { HashService } from '../hash/hash.service';
import { TokensService } from '../tokens/tokens.service';
import { JwtPayload } from '../tokens/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly hashService: HashService,
  ) {}

  async signUp(signupInputData: SignupInput): Promise<Tokens> {
    const isUserExist = await this.userService.findOne({
      username: signupInputData.username,
    });

    if (isUserExist) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.create(signupInputData);

    return await this.tokensService.generateTokens(newUser.id);
  }

  async logIn({ username, password }: LoginInput): Promise<Tokens> {
    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValidPassword: boolean = await this.hashService.comparePassword(
      user.password,
      password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.tokensService.generateTokens(user.id);
  }

  async validateUserPayload(payload: JwtPayload) {
    return await this.userService.findOne({ id: payload.userId });
  }
}
