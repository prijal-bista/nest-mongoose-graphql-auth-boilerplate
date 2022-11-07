import { Args, Mutation } from '@nestjs/graphql';
import { Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { LoginResponseType } from './graphql-types/login-response.type';
import { UserType } from 'src/user/graphql-types/user.type';
import { ConfirmEmailInput } from './inputs/confirm-email.input';
import { ResetPasswordInput } from './inputs/reset-password.input';
import { ResendEmailVerificationInput } from './inputs/resend-email-verification.input';
import { GeneralResponseType } from './graphql-types/general-response.type';
import { ForgotPasswordInput } from './inputs/forgot-password.input';

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

  @Mutation(() => GeneralResponseType)
  async sendForgotPasswordEmail(
    @Args('forgotPasswordInput') forgotPasswordInput: ForgotPasswordInput,
  ) {
    const { email } = forgotPasswordInput;
    this.authService.sendForgotPasswordEmail(email);
    return { message: `Reset password email has been sent to ${email}.` };
  }

  @Mutation(() => GeneralResponseType)
  async confirmEmail(
    @Args('confirmEmailInput') confirmEmailInput: ConfirmEmailInput,
  ) {
    await this.authService.confirmEmail(confirmEmailInput);
    return { message: `Email has been verified successfully` };
  }

  @Mutation(() => GeneralResponseType)
  async resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    await this.authService.resetPassword(resetPasswordInput);
    return { message: `Password reset successful` };
  }

  @Mutation(() => GeneralResponseType)
  async resendVerificationEmail(
    @Args('resendVerificationEmailInput')
    resendVerificationEmailInput: ResendEmailVerificationInput,
  ) {
    await this.authService.resendConfirmationEmail(
      resendVerificationEmailInput,
    );
    return {
      message: `Verificaiton email has been sent to ${resendVerificationEmailInput.email}`,
    };
  }
}
