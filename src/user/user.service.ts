import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SignupInput } from '../auth/dto/signup-input';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly hashService: HashService,
  ) {}

  async find(findOptions?: FindManyOptions<UserEntity>) {
    return this.userRepository.find(findOptions);
  }

  async findOne(conditions: Partial<UserEntity>): Promise<UserEntity> {
    return await this.userRepository.findOne(conditions);
  }

  async create(userDto: SignupInput) {
    const password = await this.hashService.hashPassword(userDto.password);
    const user = new UserEntity({ ...userDto, password });

    return await this.userRepository.save(user);
  }
}
