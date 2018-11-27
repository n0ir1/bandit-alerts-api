import { Module } from '@nestjs/common';
import { AlertsResolvers } from './alerts.resolver';
import { HistoryService } from './history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History } from './history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([History])],
  providers: [AlertsResolvers, HistoryService],
})
export class AlertsModule {}
