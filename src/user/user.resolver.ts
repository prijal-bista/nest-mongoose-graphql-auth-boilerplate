import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GetUser } from 'src/decorators/get-user.decorator';
import { GeneralResponseType } from 'src/graphql-types/general-response.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserType } from './graphql-types/user.type';
import { ChangePasswordInput } from './inputs/change-password.input';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

@Resolver(() => UserType)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UserType)
  @UseGuards(JwtAuthGuard)
  getUser(@GetUser() user: User) {
    return user;
  }

  @Mutation(() => GeneralResponseType)
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Args('changePasswordInput') changePasswordInput: ChangePasswordInput,
    @GetUser() user: User,
  ) {
    await this.userService.changePassword(user, changePasswordInput);
    return { message: `Password updated successfully` };
  }
}
