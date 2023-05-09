import { InputType, Field } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType()
export class CreateOrderInput {
  @IsIn(['espera', 'completado'])
  @Field(() => String)
  status: string = 'espera'
}
