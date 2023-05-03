import { IsInt, IsPositive } from 'class-validator';
import { CreateOrderInput } from './create-order.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number;
}
