import { InputType, Field } from '@nestjs/graphql';
import { IsArray, IsIn, IsString } from 'class-validator';
import { Price } from 'src/prices/entities/price.entity';

@InputType()
export class CreateOrderInput {
  @IsIn(['espera', 'completado'])
  @Field(() => String)
  status: string
}
