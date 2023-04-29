import { IsInt, IsPositive } from 'class-validator';
import { CreatePriceInput } from './create-price.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePriceInput extends PartialType(CreatePriceInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number
}
