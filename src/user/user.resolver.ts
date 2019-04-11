import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/user.decorator';
import { GraphqlAuthGuard } from '../common/guards/graphqlAuth.guard';
import { UserService } from './user.service';
import { User } from './models/user';
import { UserArgs } from './dto/user.args';

@Resolver(of => User)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  @UseGuards(GraphqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    return await this.userService.findByUserId(user.userId);
  }

  @Query(returns => User)
  async user(@Args() args: UserArgs) {
    const { id, name } = args;

    if (name) {
      return await this.userService.findByName(name);
    }

    if (id) {
      return await this.userService.findByUserId(id);
    }

    throw new Error('Args is empty');
  }
}
