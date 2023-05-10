import { InputType, Field } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType({
  description: 'Schema of the information expected to create a new service order'
})
export class CreateOrderInput {
  @IsIn(['espera', 'completado'])
  @Field(() => String, {
    description: 'order status [waiting or completed]'
  })
  status: string = 'espera'
}
