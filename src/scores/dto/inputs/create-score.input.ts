import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsInt, IsPositive, IsOptional, IsNumber } from 'class-validator';

@InputType()
export class CreateScoreInput {

  @IsNumber()
  @IsPositive()
  @Field(() => Int)
  rank: number

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  quality: string

}
