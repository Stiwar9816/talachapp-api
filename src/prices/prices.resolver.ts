import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Services
import { PricesService } from './prices.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)
import { CreatePriceInput, UpdatePriceInput } from './dto';
import { Price } from './entities/price.entity';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Price)
@UseGuards(JwtAuthGuard)
export class PricesResolver {
  constructor(private readonly pricesService: PricesService) { }

  @Mutation(() => Price, { name: 'createPrice', description: 'Create a new price for either a [product, service, or cost]' })
  createPrice(
    @Args('createPriceInput') createPriceInput: CreatePriceInput,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.TALACHERO]) user: User
  ): Promise<Price> {
    return this.pricesService.create(createPriceInput, user);
  }

  @Query(() => [Price], { name: 'prices', description: 'Search all prices' })
  findAll(
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.TALACHERO]) user: User
  ): Promise<Price[]> {
    return this.pricesService.findAll();
  }

  @Query(() => Price, { name: 'price', description: 'Search for a single price by price ID' })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.TALACHERO]) user: User
  ): Promise<Price> {
    return this.pricesService.findOne(id);
  }

  @Mutation(() => Price, { name: 'updatePrice', description: 'Update the price data' })
  updatePrice(
    @Args('updatePriceInput') updatePriceInput: UpdatePriceInput,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.TALACHERO]) user: User
  ): Promise<Price> {
    return this.pricesService.update(updatePriceInput.id, updatePriceInput, user);
  }

  @Mutation(() => Price, { name: 'removePrice', description: 'Delete a price with a unique ID' })
  removePrice(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.ADMIN, UserRoles.SUPERADMIN, UserRoles.TALACHERO]) user: User
  ): Promise<Price> {
    return this.pricesService.remove(id);
  }
}
