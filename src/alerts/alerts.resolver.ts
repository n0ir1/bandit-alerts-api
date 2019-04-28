import { Mutation, Resolver, Subscription, Query, Args } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { HistoryService } from './history.service';
import { UseGuards, Inject, NotFoundException } from '@nestjs/common';
import { Alert } from './models/alert';
import { NewAlertInput } from './dto/new-alert.input';
import { GraphqlAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from '../user/models/user';
import { PUB_SUB } from '../constants';
import { UserService } from '../user/user.service';

@Resolver(of => Alert)
export class AlertsResolvers {
  constructor(
    private readonly historyService: HistoryService,
    private readonly userService: UserService,
    @Inject(PUB_SUB) private readonly pubsub: PubSub,
  ) {}

  @Query(returns => [Alert])
  @UseGuards(GraphqlAuthGuard)
  async alerts(@CurrentUser() user: User) {
    return await this.historyService.find({
      where: {
        id: user.id,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  @Mutation(returns => Boolean)
  async addDonationAlert(
    @Args('newAlertInput') newAlertInputData: NewAlertInput,
  ): Promise<boolean> {
    const user = await this.userService.findOne({
      id: newAlertInputData.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const alert: Alert = await this.historyService.save(newAlertInputData);

    this.pubsub.publish('newDonationAlert', { newDonationAlert: alert });
    return true;
  }

  @Subscription(returns => Alert, {
    filter: (payload: any, variables: any) => {
      return payload.newDonationAlert.id === variables.id;
    },
  })
  newDonationAlert(@Args('id') id: string) {
    return this.pubsub.asyncIterator('newDonationAlert');
  }
}
