import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsInt } from "class-validator";

@ArgsType()
export class CompaniesIdArgs {
    @IsInt()
    @Field(() => Int)
    idCompany: number
}