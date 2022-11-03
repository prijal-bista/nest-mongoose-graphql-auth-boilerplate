import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from 'src/user/graphql-types/user.type';

@ObjectType('loginResponse')
export class LoginResponseType {
  @Field()
  accessToken: string;

  @Field()
  user: UserType;
}
