import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsUUID } from "class-validator";

@ArgsType()
export class CompanyWorkerArgs {
    @IsUUID()
    @IsOptional()
    @Field(() => String, { nullable: true })
    companyWorker?: string
}