import { Length, IsNumber, Min, IsString } from 'class-validator';
import { Field, InputType, ID, Int } from 'type-graphql';

@InputType()
export class NewAlertInput {
  @Field(type => ID)
  userId: string;

  @Field(type => ID)
  donatorId: string;

  @Field()
  @Length(1, 200)
  @IsString()
  text: string;

  @Field(type => Int)
  @IsNumber()
  @Min(1)
  amount: number;
}
