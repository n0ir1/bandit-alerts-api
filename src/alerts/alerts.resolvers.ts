import { Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { withFilter, PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

@Resolver('Alerts')
export class AlertsResolvers {
  @Mutation('donationAlertsSend')
  async create(obj, args, data) {
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
