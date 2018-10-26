import { Module } from '@nestjs/common';
import { AlertsResolvers } from './alerts.resolvers';
import { AlertsService } from './alerts.service';

@Module({
  providers: [AlertsService, AlertsResolvers],
})
export class AlertsModule {}
