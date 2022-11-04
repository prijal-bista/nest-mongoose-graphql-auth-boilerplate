import { Field, InputType } from '@nestjs/graphql';
import { MinLength, IsEmail, Matches } from 'class-validator';
import { Match } from 'src/decorators/match.decorator';

@InputType()
export class RegisterInput {
  @Field()
  @MinLength(3)
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: `Password must contain at least 1 upper case letter, 1 lower case letter, 1 number or special character.`,
  })
  password: string;

  @Field()
  @Match('password', { message: `Password doesnot match.` })
  passwordConfirmation: string;
}
