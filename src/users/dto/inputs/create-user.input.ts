import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from 'class-validator';
@InputType()
export class CreateUserInput {
  @IsEmail()
  @Field(() => String, {
    description: 'User email'
  })
  email: string

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Full name of the user'
  })
  fullName: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    nullable: true,
    description: 'User phone'
  })
  phone: number

  @IsString()
  @MinLength(6)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  @Field(() => String, {
    description:
      `
    User password that must have a minimum length of 6 digits
    and the password must have an Uppercase, lowercase letter and a number
    `
  })
  password: string
}
