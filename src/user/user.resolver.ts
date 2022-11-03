import { UseGuards } from '@nestjs/common';
import { Context, Query, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserType } from './graphql-types/user.type';
import { UserService } from './user.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  getUser(@Context() context) {
    return context.req.user;
  }
}
