import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsIn } from 'class-validator';

@InputType()
export class CreatePaymentInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  toll: string

  @IsString()
  @Field(() => String)
  transfer: string

  @IsString()
  @Field(() => String)
  banner: string

  @IsString()
  @Field(() => String)
  card_type: string

  @IsString()
  @Field(() => String)
  bank_name: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float)
  total: number

  @IsString()
  @IsIn(['espera', 'procesando', 'pagado'])
  @Field(() => [String])
  state: string[]
}
