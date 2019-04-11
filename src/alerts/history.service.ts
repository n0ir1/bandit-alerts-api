import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { History as HistoryEntity } from './history.entity';

interface IAlertPayload {
  userId: string;
  donatorId: string;
  amount: number;
  text: string;
}

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

  async add(alertPayload: IAlertPayload) {
    const alert = new HistoryEntity();
    Object.keys(alertPayload).forEach(field => {
      alert[field] = alertPayload[field];
    });

    return this.historyRepository.save(alert);
  }
}
