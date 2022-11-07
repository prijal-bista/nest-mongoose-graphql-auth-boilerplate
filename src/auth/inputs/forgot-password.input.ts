import { InputType } from '@nestjs/graphql';
import { ResendEmailVerificationInput } from './resend-email-verification.input';

@InputType()
export class ForgotPasswordInput extends ResendEmailVerificationInput {}
