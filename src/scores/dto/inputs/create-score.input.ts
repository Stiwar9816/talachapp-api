import { InputType, Int, Field } from '@nestjs/graphql';
import { IsInt, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

@InputType({
  description: 'Summary of information that is expected to create a new rating'
})
export class CreateScoreInput {
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(5)
  @Field(() => Int, {
    description: 'Rating that the user gives to the company or vice versa score from 1 to 5'
  })
  rank: number

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Quality of service provided'
  })
  quality?: string
}
