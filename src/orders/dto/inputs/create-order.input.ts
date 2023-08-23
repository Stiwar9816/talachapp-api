import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';

@InputType({
  description: 'Schema of the information expected to create a new service order'
})
export class CreateOrderInput {

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'order status [waiting or completed]'
  })
  status?: string

  @IsNumber()
  @IsOptional()
  @Field(() => Float, { nullable: true })
  total?: number
}
