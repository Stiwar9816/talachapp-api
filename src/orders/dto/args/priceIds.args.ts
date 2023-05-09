import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsArray, IsInt } from "class-validator";

@ArgsType()
export class PriceIdsArgs {
    @IsArray()
    @IsInt({ each: true })
    @Field(() => [Int])
    ids: number[]
}