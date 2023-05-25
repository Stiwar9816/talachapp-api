import { InputType, Field, Float } from '@nestjs/graphql';
import { IsEmail, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Matches, MinLength } from 'class-validator';
import { randomPassword } from 'src/auth/utils/randomPassword';
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
    description: 'User phone'
  })
  phone: number

  @IsString()
  @MinLength(6)
  @IsOptional()
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
  password?: string = randomPassword()

  @IsIn(['Activo', 'Inactivo'])
  @Field(() => String, {
    description: 'User status in the system [ active (true) or inactive (false) ]'
  })
  isActive: string = 'Activo'
}
