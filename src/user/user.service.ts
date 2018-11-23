import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { User as UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findOne(findOptions?: FindOneOptions) {
    return this.userRepository.findOne(findOptions);
  }

  async find(findOptions?: FindManyOptions<UserEntity>) {
    return this.userRepository.find(findOptions);
  }

  async create(userPayload) {
    const alert = new UserEntity();
    Object.keys(userPayload).forEach(field => {
      alert[field] = userPayload[field];
    });

    return this.userRepository.save(alert);
  }
}
