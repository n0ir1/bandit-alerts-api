import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user';
import { UserArgs } from './dto/user.args';
import { GraphqlAuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Resolver(of => User)
export class UserResolvers {
  constructor(private readonly userService: UserService) {}

  @Query(returns => User)
  @UseGuards(GraphqlAuthGuard)
  async currentUser(@CurrentUser() { id }: User) {
    return await this.userService.findOne({ id });
  }

  @Query(returns => User)
  async user(@Args() args: UserArgs) {
    const user = await this.userService.findOne(args);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
