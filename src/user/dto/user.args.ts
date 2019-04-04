import { Field, ID, ArgsType } from 'type-graphql';
import { IsString, IsOptional } from 'class-validator';

@ArgsType()
export class UserArgs {
  @Field(type => ID, { nullable: true })
  @IsOptional()
  id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  name?: string;
}
