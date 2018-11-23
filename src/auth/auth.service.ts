import { pbkdf2Sync, randomBytes } from 'crypto';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserService } from '../user/user.service';
import { config } from '../../config';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  private getHash(password, salt) {
    return pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
  }

  public hashPassword(password) {
    const salt = randomBytes(32).toString('hex');
    const hash = this.getHash(password, salt);
    return [salt, hash].join('$');
  }

  public checkPassword(saltedPasswordHash, candidatePassword) {
    const originalHash = saltedPasswordHash.split('$')[1];
    const salt = saltedPasswordHash.split('$')[0];
    const hash = this.getHash(candidatePassword, salt);
    return hash == originalHash;
  }

  async signUp({ username, password }) {
    const checkUser = await this.userService.findOne({
      where: {
        username,
      },
    });
    if (checkUser) {
      return new Error('Duplicate user');
    }
    const newUser = await this.userService.create({
      username,
      password: this.hashPassword(password),
    });

    return await this.createToken(newUser.id);
  }

  async logIn(username: string, password: string) {
    const user = await this.userService.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    const isValidPassword = this.checkPassword(user.password, password);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    return user;
  }

  async createToken(userId) {
    const user = { userId };
    return await jwt.sign(user, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  async verify(payload) {
    const user = await this.userService.findOne({
      where: {
        id: payload.userId,
      },
    });

    if (!user) {
      return new Error('Invalid authorization');
    }

    return user;
  }
}
