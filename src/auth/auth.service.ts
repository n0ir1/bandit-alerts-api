import { Injectable } from '@nestjs/common';
import * as upash from 'upash';
import * as pbkdf2 from '@phc/pbkdf2';
import { UserService } from '../user/user.service';
import { TokensService } from './tokens.service';
import { User } from '../user/models/user';
import { Tokens } from './models/tokens';

interface IAuthData {
  username: string;
  password: string;
}

upash.install('pbkdf2', pbkdf2);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await upash.hash(password);
  }

  async checkPassword(hashstr: string, password: string): Promise<boolean> {
    return await upash.verify(hashstr, password);
  }

  async signUp({ username, password }: IAuthData): Promise<Tokens> {
    const checkUser = await this.userService.findOne({
      where: {
        username,
      },
    });

    if (checkUser) {
      throw new Error('Duplicate user');
    }

    const newUser = await this.userService.create({
      username,
      password: await this.hashPassword(password),
    });

    return await this.tokensService.generateTokens(newUser.userId);
  }

  async logIn({ username, password }: IAuthData): Promise<User> {
    const user = await this.userService.findByName(username);

    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this.checkPassword(user.password, password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return user;
  }
}
