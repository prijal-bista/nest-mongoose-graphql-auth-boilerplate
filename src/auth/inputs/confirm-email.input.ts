import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ConfirmEmailInput {
  @Field()
  @IsNotEmpty()
  token: string;

  // @Field()
  // email: string;
}
