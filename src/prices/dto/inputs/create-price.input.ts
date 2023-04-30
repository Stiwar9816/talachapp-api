import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsArray, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreatePriceInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  price: number

  @IsInt()
  @IsPositive()
  @Min(1)
  @Field(() => Int)
  stock: number

  @IsString()
  @IsArray()
  @IsIn(['product', 'service', 'costs'])
  @Field(() => [String])
  type: string[]

  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string
}
