import { Args, Mutation } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { LoginResponseType } from './graphql-types/login-response.type';
import { UserType } from 'src/user/graphql-types/user.type';

@Resolver(() => UserType)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => UserType)
  register(@Args('registerInput') registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Mutation(() => LoginResponseType)
  login(@Args('loginInput') loginInput: LoginInput) {
    return this.authService.login(loginInput);
  }
}
