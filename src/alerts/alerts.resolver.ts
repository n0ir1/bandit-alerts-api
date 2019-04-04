import { Mutation, Resolver, Subscription, Query, Args } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { HistoryService } from './history.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/graphqlAuth.guard';
import { Alert } from './models/alert';
import { NewAlertInput } from './dto/new-alert.input';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/models/user';

const pubsub = new PubSub();

@Resolver(of => Alert)
export class AlertsResolvers {
  constructor(private readonly historyService: HistoryService) {}

  @Query(returns => [Alert])
  @UseGuards(GraphqlAuthGuard)
  async alerts(@CurrentUser() user: User) {
    return await this.historyService.find({
      where: {
        userId: user.userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Mutation(returns => Boolean, { nullable: true })
  async addDonationAlert(@Args('newAlertInput') newAlertInput: NewAlertInput) {
    const alert = await this.historyService.add(newAlertInput);

    pubsub.publish('newDonationAlert', { newDonationAlert: alert });
    return true;
  }

  @Subscription(returns => Alert, {
    filter: (payload: any, variables: any) =>
      payload.newDonationAlert.userId === variables.id,
  })
  newDonationAlert(@Args('id') id: string) {
    return pubsub.asyncIterator('newDonationAlert');
  }
}
