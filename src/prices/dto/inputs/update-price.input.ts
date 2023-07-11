import { IsUUID } from 'class-validator';
import { CreatePriceInput } from './create-price.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType({
  description:
    `
  Diagram of the fields enabled to be able to be modified 
  by the admin or talachero for a specific price
  `
})
export class UpdatePriceInput extends PartialType(CreatePriceInput) {
  @IsUUID()
  @Field(() => String, {
    description: 'Id automatically generated in integer format eg: 1,2,3..'
  })
  id: string
}
