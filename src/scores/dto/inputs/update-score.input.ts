import { IsInt, IsPositive } from 'class-validator';
import { CreateScoreInput } from './create-score.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateScoreInput extends PartialType(CreateScoreInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number;
}
