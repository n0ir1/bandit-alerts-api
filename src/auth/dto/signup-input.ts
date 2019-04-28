import { Field, InputType } from 'type-graphql';
import { IsString } from 'class-validator';
import { Trim } from '../../common/decorators/trim.decorator';

@InputType()
export class SignupInput {
  @Field()
  @IsString()
  @Trim()
  username: string;

  @Field()
  @IsString()
  @Trim()
  password: string;
}
