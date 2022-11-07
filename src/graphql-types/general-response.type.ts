import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('GeneralResponse')
export class GeneralResponseType {
  @Field()
  message: string;
}
