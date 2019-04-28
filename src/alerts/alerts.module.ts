import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertsResolvers } from './alerts.resolver';
import { HistoryService } from './history.service';
import { HistoryEntity } from './entities/history.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([HistoryEntity])],
  providers: [AlertsResolvers, HistoryService],
})
export class AlertsModule {}
