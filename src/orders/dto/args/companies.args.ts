import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";

@ArgsType()
export class CompaniesIdArgs {
    @IsUUID()
    @IsOptional()
    @Field(() => String, { nullable: true })
    idCompany?: string
}