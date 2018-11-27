import { Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { withFilter, PubSub } from 'graphql-subscriptions';
import { HistoryService } from './history.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'auth/guard/graphqlAuth.guard';

const pubsub = new PubSub();

@Resolver('Alerts')
export class AlertsResolvers {
  constructor(private readonly historyService: HistoryService) {}

  @Query('alerts')
  @UseGuards(GraphqlAuthGuard)
  async getAlerts(obj, args, ctx) {
    return await this.historyService.find({
      where: {
        username: ctx.req.user.username,
      },
    });
  }

  @Mutation('donationAlertsSend')
  async create(obj, args) {
    const alert = await this.historyService.add({
      username: args.username,
      text: args.text,
      amount: args.amount,
    });

    pubsub.publish('newDonationAlert', { newDonationAlert: args });
    return args;
  }

  @Subscription('newDonationAlert')
  newDonationAlert() {
    return {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newDonationAlert'),
        (payload, variables) => {
          return payload.newDonationAlert.id === variables.id;
        },
      ),
    };
  }
}
