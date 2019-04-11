import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Tokens {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}
