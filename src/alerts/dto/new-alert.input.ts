import { Length, IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';
import { Field, InputType, ID, Int } from 'type-graphql';
import { Trim } from '../../common/decorators/trim.decorator';

@InputType()
export class NewAlertInput {
  @Field(type => ID)
  userId: string;

  @Field(type => ID)
  donatorId: string;

  @Field()
  @IsNotEmpty()
  @Length(1, 200)
  @IsString()
  @Trim()
  text: string;

  @Field(type => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;
}
