import { Field, ArgsType } from 'type-graphql';
import { IsString } from 'class-validator';

@ArgsType()
export class TokensArgs {
  @Field()
  @IsString()
  refreshToken: string;
}
