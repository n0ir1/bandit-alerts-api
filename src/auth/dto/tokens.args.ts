import { Field, ArgsType } from 'type-graphql';
import { IsString, IsNotEmpty } from 'class-validator';

@ArgsType()
export class TokensArgs {
  @Field()
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
