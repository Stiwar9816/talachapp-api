import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateOrderInput } from './create-order.input';
import { IsUUID } from 'class-validator';

@InputType({
  description: `
  Diagram of the fields enabled to be able to be modified by the admin, 
  talachero or user by default for a specific service order  
  `,
})
export class UpdateOrderInput extends PartialType(CreateOrderInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..',
  })
  id: string;
}
