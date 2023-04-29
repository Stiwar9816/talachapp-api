import { IsInt, IsPositive } from 'class-validator';
import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  id: number;
}
