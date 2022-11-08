import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Matches, MinLength } from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsNotEmpty()
  currentPassword: string;

  @Field()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password must contain at least 1 upper case letter, 1 lower case letter, 1 number or special character.`,
  })
  newPassword: string;

  @Field()
  @Match('newPassword', { message: `Password doesnot match.` })
  newPasswordConfirmation: string;
}
