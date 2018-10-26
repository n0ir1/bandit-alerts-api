import { ParseIntPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AlertsGuard } from './alerts.guard';
import { AlertsService } from './alerts.service';

const pubSub = new PubSub();

@Resolver('Alerts')
export class AlertsResolvers {
  constructor(private readonly alertsService: AlertsService) {}

  @Query()
  @UseGuards(AlertsGuard)
  async getDonationAlerts() {
    return await this.alertsService.findAll();
  }

  @Query('donationAlert')
  async findOneById(obj, { id }) {
    return await this.alertsService.findOneById(id);
  }

  @Mutation('donationAlertsSend')
  async create(obj, args, data) {
    const { id, username, amount, text } = args;
    const donationAlert = await this.alertsService.create({
      id,
      username,
      amount,
      text,
    });
    pubSub.publish('newDonationAlert', { newDonationAlert: donationAlert });
    return donationAlert;
  }

  @Subscription('newDonationAlert')
  newDonationAlert() {
    return {
      subscribe: () => pubSub.asyncIterator('newDonationAlert'),
    };
  }
}
