import { Inject, ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
// Services
import { PricesService } from './prices.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)
import { CreatePriceInput, UpdatePriceInput } from './dto';
import { Price } from './entities/price.entity';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Price)
@UseGuards(JwtAuthGuard)
export class PricesResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly pricesService: PricesService
  ) { }

  @Mutation(() => Price, {
    name: 'createPrice',
    description: 'Create a new price for either a [product, service, or cost]'
  })
  createPrice(
    @Args('createPriceInput') createPriceInput: CreatePriceInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Price> {
    const createPrice = this.pricesService.create(createPriceInput, user);
    this.pubSub.publish('newPrice', { newPrice: createPrice })
    return
  }

  @Query(() => [Price], {
    name: 'prices',
    description: 'Search all prices'
  })
  findAll(
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Price[]> {
    return this.pricesService.findAll();
  }

  @Query(() => Price, {
    name: 'price',
    description: 'Search for a single price by price ID'
  })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Price> {
    return this.pricesService.findOne(id);
  }

  @Query(() => [Price], {
    name: 'priceByType',
    description: 'Filters all prices depending on the type passed as a parameter'
  })
  findAllByType(
    @Args('priceType', { type: () => String }) price: Price,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User,
  ): Promise<Price[]> {
    return this.pricesService.findAllByType(price, user);
  }

  @Query(() => [Price])
  pricesByIds(@Args({ name: 'ids', type: () => [Int] }) ids: number[]): Promise<Price[]> {
    return this.pricesService.findAllId(ids)
  }

  @Mutation(() => Price, {
    name: 'updatePrice',
    description: 'Update the price data'
  })
  updatePrice(
    @Args('updatePriceInput') updatePriceInput: UpdatePriceInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Price> {
    return this.pricesService.update(updatePriceInput.id, updatePriceInput, user);
  }

  @Mutation(() => Price, {
    name: 'removePrice',
    description: 'Delete a price with a unique ID'
  })
  removePrice(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Price> {
    return this.pricesService.remove(id);
  }

  @Subscription(() => Price, {
    name: 'newPrice',
    description: 'Subscribe to new prices'
  })
  subscribeNewPrice(): AsyncIterator<Price> {
    return this.pubSub.asyncIterator('newPrice')
  }
}
