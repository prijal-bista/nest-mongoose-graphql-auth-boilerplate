import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('user')
export class UserType {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => [String])
  roles: string[];

  @Field(() => Date, { nullable: true })
  emailVerifiedAt: Date | null;
}
