import { Module } from '@nestjs/common';
import { AlertsResolvers } from './alerts.resolvers';

@Module({
  providers: [AlertsResolvers],
})
export class AlertsModule {}
