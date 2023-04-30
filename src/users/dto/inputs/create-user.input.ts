import { InputType, Int, Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsIn, IsInt, IsBoolean } from 'class-validator';

@InputType()
export class CreateUserInput {

  @IsString()
  @Field(() => String)
  name: string

  @IsInt()
  @IsPositive()
  @Field(() => Int)
  phone: number

  @IsString()
  @Field(() => String)
  email: string

  @IsBoolean()
  @Field(() => Boolean)
  isActive: boolean

  @IsString()
  @Field(() => String)
  password: string
  
  @IsString()
  @IsIn(['usuario', 'talachero'])
  @Field(() => [String])
  state: string[]
}
