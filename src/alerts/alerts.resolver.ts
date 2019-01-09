import { Mutation, Resolver, Subscription, Query } from '@nestjs/graphql';
import { withFilter, PubSub } from 'graphql-subscriptions';
import { HistoryService } from './history.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'auth/guards/graphqlAuth.guard';
import { AuthGuard } from 'auth/guards/auth.guard';

const pubsub = new PubSub();

@Resolver('Alerts')
export class AlertsResolvers {
  constructor(private readonly historyService: HistoryService) {}

  @Query('alerts')
  @UseGuards(GraphqlAuthGuard)
  @UseGuards(AuthGuard)
  async getAlerts(obj, args, ctx) {
    return await this.historyService.find({
      where: {
        userId: ctx.req.user.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Mutation('donationAlertsSend')
  async create(obj, args) {
    const { userId, donatorId, text, amount } = args;
    const alert = await this.historyService.add({
      userId,
      donatorId,
      text,
      amount,
    });

    pubsub.publish('newDonationAlert', { newDonationAlert: alert });
    return true;
  }

  @Subscription('newDonationAlert')
  newDonationAlert() {
    return {
      subscribe: withFilter(
        () => pubsub.asyncIterator('newDonationAlert'),
        (payload, variables) => {
          return payload.newDonationAlert.userId === variables.id;
        },
      ),
    };
  }
}
