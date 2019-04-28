import { Field, ID, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class Alert {
  @Field(type => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  donatorId: string;

  @Field(type => Int)
  amount: number;

  @Field()
  text: string;

  @Field(type => Date)
  createdAt: string;
}
