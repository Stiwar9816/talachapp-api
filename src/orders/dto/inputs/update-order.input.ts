import { IsPositive, IsString, IsUUID } from 'class-validator';
import { CreateOrderInput } from './create-order.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({
  description:
    `
  Diagram of the fields enabled to be able to be modified by the admin, 
  talachero or user by default for a specific service order  
  `
})
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: string;
}
