import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { HistoryEntity } from './entities/history.entity';
import { NewAlertInput } from './dto/new-alert.input';

@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
  ) {}

  async findOne(findOptions?: FindOneOptions<HistoryEntity>) {
    return this.historyRepository.findOne(findOptions);
  }

  async find(findOptions?: FindManyOptions<HistoryEntity>) {
    return this.historyRepository.find(findOptions);
  }

  async save(newAlertInputData: NewAlertInput) {
    const alert = new HistoryEntity({ ...newAlertInputData });

    return await this.historyRepository.save(alert);
  }
}
