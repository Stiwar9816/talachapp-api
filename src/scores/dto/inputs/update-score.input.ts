import { IsInt, IsPositive } from 'class-validator';
import { CreateScoreInput } from './create-score.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType({
  description:
    `
  Diagram of the fields enabled to be able to be modified by the admin,
  talachero or user by default for a specific qualification
  `
})
export class UpdateScoreInput extends PartialType(CreateScoreInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number;
}
