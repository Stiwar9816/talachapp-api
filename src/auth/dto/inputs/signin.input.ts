import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, IsString, MinLength } from "class-validator"

@InputType({
    description: 'Diagram of the fields requested for system login'
})
export class SigninInput {

    @IsEmail()
    @Field(() => String, {
        description: 'User email'
    })
    email: string

    @IsString()
    @MinLength(6)
    @Field(() => String, {
        description:
            `
        User password that must have a minimum length of 6 digits
        and the password must have an Uppercase, lowercase letter and a number
        `
    })
    password: string
}