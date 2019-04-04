import { Field, InputType } from 'type-graphql';
import { IsString } from 'class-validator';

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  username: string;

  @Field()
  @IsString()
  password: string;
}
