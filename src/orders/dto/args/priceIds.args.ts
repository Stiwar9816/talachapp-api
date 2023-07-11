import { ArgsType, Field } from "@nestjs/graphql";
import { IsArray, IsUUID } from "class-validator";

@ArgsType()
export class PriceIdsArgs {
    @IsArray()
    @Field(() => [String])
    ids: string[]
}