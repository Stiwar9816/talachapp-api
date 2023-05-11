import { IsInt, IsPositive } from 'class-validator';
import { CreatePaymentInput } from './create-payment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType({
  description:
    `
  Diagram of the fields enabled to be able to be 
  modified by the admin or talachero for a specific payment
  `
})
export class UpdatePaymentInput extends PartialType(CreatePaymentInput) {
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: number;
}
