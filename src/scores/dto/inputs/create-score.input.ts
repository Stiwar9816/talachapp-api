import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

@InputType()
export class CreateScoreInput {
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(5)
  @Field(() => Int)
  rank: number

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  quality?: string
}
