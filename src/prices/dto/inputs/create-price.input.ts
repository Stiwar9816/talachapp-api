import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType({
  description: 'Outline of information that is expected to create a new price for a [product, service, or cost]'
})
export class CreatePriceInput {

  @IsString()
  @IsNotEmpty()
  @Field(() => String, {
    description: 'Name of the product, service or fixed cost'
  })
  name: string

  @IsNumber()
  @IsPositive()
  @Field(() => Float, {
    description: 'Assigned value for a product, service or a fixed cost'
  })
  price: number

  @IsInt()
  @IsPositive()
  @IsOptional()
  @Min(1)
  @Field(() => Int, {
    description: 'Quantity of the price or product in inventory'
  })
  stock?: number

  @IsIn(["product", "service", "costs"])
  @Field(() => String, {
    description: 'Type of price which can be [ product, service or fixed cost ]'
  })
  type: string

  @IsString()
  @IsOptional()
  @Field(() => String, {
    nullable: true,
    description: 'Description of the added elements [ products, services or fixed costs ]'
  })
  description?: string
}
