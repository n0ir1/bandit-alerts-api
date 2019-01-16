import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../auth/guards/graphqlAuth.guard';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query('user')
  @UseGuards(GraphqlAuthGuard)
  async user(obj, args, ctx) {
    if (args.name) {
      return await this.userService.findByName(args.name);
    }

    let id = args.id;
    if (!args.name && !args.id) {
      if (!ctx.req.user) {
        throw new Error('Unauthorized');
      }
      id = ctx.req.user.userId;
    }
    return await this.userService.findByUserId(id);
  }
}
