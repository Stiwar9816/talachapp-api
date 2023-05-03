import { Field, Float, InputType } from "@nestjs/graphql"
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from "class-validator"

@InputType()
export class SignupInput {
    @IsEmail()
    @Field(() => String)
    email: string

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    fullName: string

    @IsNumber()
    @IsPositive()
    @Field(() => Float)
    phone: number

    @IsString()
    @MinLength(6)
    @Field(() => String)
    password: string
}