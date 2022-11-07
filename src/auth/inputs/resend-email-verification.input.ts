import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class ResendEmailVerificationInput {
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
