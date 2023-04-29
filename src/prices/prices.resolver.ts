import { ParseIntPipe } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Services
import { PricesService } from './prices.service';
// Entity/Input
import { CreatePriceInput, UpdatePriceInput } from './dto';
import { Price } from './entities/price.entity';

@Resolver(() => Price)
export class PricesResolver {
  constructor(private readonly pricesService: PricesService) { }

  @Mutation(() => Price, { name: 'createPrice' })
  createPrice(@Args('createPriceInput') createPriceInput: CreatePriceInput): Promise<Price> {
    return this.pricesService.create(createPriceInput);
  }

  @Query(() => [Price], { name: 'prices' })
  findAll(): Promise<Price[]> {
    return this.pricesService.findAll();
  }

  @Query(() => Price, { name: 'price' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Price> {
    return this.pricesService.findOne(id);
  }

  @Mutation(() => Price, { name: 'updatePrice' })
  updatePrice(@Args('updatePriceInput') updatePriceInput: UpdatePriceInput): Promise<Price> {
    return this.pricesService.update(updatePriceInput.id, updatePriceInput);
  }

  @Mutation(() => Price, { name: 'removePrice' })
  removePrice(@Args('id', { type: () => Int }, ParseIntPipe) id: number): Promise<Price> {
    return this.pricesService.remove(id);
  }
}
