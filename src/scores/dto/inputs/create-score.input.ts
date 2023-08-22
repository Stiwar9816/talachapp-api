import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

@InputType({
  description: 'Summary of information that is expected to create a new rating',
})
export class CreateScoreInput {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Max(5)
  @Field(() => Float, {
    description:
      'Rating that the user gives to the company or vice versa score from 1 to 5',
    nullable: true,
  })
  rankClient?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Max(5)
  @Field(() => Float, {
    description:
      'Rating that the user gives to the company or vice versa score from 1 to 5',
    nullable: true,
  })
  rankTalachero?: number;

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Quality of service provided',
  })
  quality?: string;
}
