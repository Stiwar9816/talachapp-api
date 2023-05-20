import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsIn } from 'class-validator';

@InputType({
  description: 'Schema of the information expected to create a new payment'
})
export class CreatePaymentInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Value of the payment of the service provided'
  })
  toll: string

  @IsString()
  @Field(() => String, {
    description: ''
  })
  transfer: string

  @IsString()
  @Field(() => String, {
    description: ''
  })
  banner: string

  @IsString()
  @Field(() => String, {
    description: 'User card type'
  })
  card_type: string

  @IsString()
  @Field(() => String, {
    description: 'Name of the bank that the user uses'
  })
  bank_name: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    description: 'Total bill of requested services'
  })
  total: number

  @IsString()
  @IsIn(['Espera', 'Procesando', 'Pagado'])
  @Field(() => [String], {
    description: 'payment status [waiting, processing or completed]'
  })
  state: string[]
}
