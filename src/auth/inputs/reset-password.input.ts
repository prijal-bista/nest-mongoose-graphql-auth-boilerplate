import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

@InputType()
export class ResetPasswordInput {
  @Field()
  @IsNotEmpty()
  token: string;

  @Field()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password must contain at least 1 upper case letter, 1 lower case letter, 1 number or special character.`,
  })
  newPassword: string;

  @Field()
  @Match('newPassword', { message: `Password doesnot match.` })
  passwordConfirmation: string;
}
