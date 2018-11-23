import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'auth/guard/graphqlAuth.guard';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query('user')
  @UseGuards(GraphqlAuthGuard)
  async user(obj, args, ctx) {
    if (!ctx.req.user) {
      throw new Error('Unauthorized');
    }

    return await this.userService.findOne(ctx.req.user.id);
  }
}
