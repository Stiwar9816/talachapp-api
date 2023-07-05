import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Service
import { OrdersService } from './orders.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)
import { CreateOrderInput, UpdateOrderInput } from './dto';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
// Args
import { PriceIdsArgs } from './dto/args/priceIds.args';
import { CompaniesIdArgs } from './dto/args/companies.args';

@Resolver(() => Order)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService
  ) { }

  @Mutation(() => Order, {
    name: 'createOrder',
    description: 'Create a new service order'
  })
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: User,
    @Args() ids: PriceIdsArgs,
    @Args() company: CompaniesIdArgs
  ): Promise<Order> {
    return this.ordersService.create(createOrderInput, user, ids, company);
  }

  @Query(() => [Order], {
    name: 'orders',
    description: 'Search all service orders'
  })
  findAll(
    @CurrentUser() user: User
  ): Promise<Order[]> {
    return this.ordersService.findAll(user);
  }

  @Query(() => Order, {
    name: 'order',
    description: 'Search for a service order by order ID'
  })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order, {
    name: 'updateOrder',
    description: 'Update order status'
  })
  updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ): Promise<Order> {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput, user);
  }

  @Mutation(() => Order, {
    name: 'removeOrder',
    description: 'Delete the order'
  })
  removeOrder(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ): Promise<Order> {
    return this.ordersService.remove(id);
  }
}
