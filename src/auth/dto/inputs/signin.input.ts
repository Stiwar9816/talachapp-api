import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsString, MinLength } from "class-validator"

@InputType()
export class SigninInput {

    @IsEmail()
    @Field(() => String)
    email: string

    @IsString()
    @MinLength(6)
    @Field(() => String)
    password: string
}