import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';
@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String)
  email: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Field(() => Float)
  phone?: number

  @IsString()
  @MinLength(6)
  @Field(() => String)
  password: string
}
