import { Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
// Service
import { OrdersService } from './orders.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)/Args
import { CreateOrderInput, UpdateOrderInput } from './dto';
import { Order } from './entities/order.entity';
import { User } from 'src/users/entities/user.entity';
// Subcription
import { PubSub } from 'graphql-subscriptions';
// Common / Args
import { CompaniesIdArgs, PriceIdsArgs } from 'src/common';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly ordersService: OrdersService,
  ) {}

  @Mutation(() => Order, {
    name: 'createOrder',
    description: 'Create a new service order',
  })
  @UseGuards(JwtAuthGuard)
  createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput,
    @CurrentUser() user: User,
    @Args() ids: PriceIdsArgs,
    @Args() company: CompaniesIdArgs,
  ): Promise<Order> {
    const createOrder = this.ordersService.create(
      createOrderInput,
      user,
      ids,
      company,
    );
    this.pubSub.publish('newOrder', { newOrder: createOrder });
    return createOrder;
  }

  @Query(() => [Order], {
    name: 'orders',
    description: 'Search all service orders',
  })
  @UseGuards(JwtAuthGuard)
  findAll(@CurrentUser() user: User): Promise<Order[]> {
    return this.ordersService.findAll(user);
  }

  @Query(() => Order, {
    name: 'order',
    description: 'Search for a service order by order ID',
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order, {
    name: 'updateOrder',
    description: 'Update order status',
  })
  @UseGuards(JwtAuthGuard)
  updateOrder(
    @Args('updateOrderInput') updateOrderInput: UpdateOrderInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<Order> {
    return this.ordersService.update(
      updateOrderInput.id,
      updateOrderInput,
      user,
    );
  }

  @Mutation(() => Order, {
    name: 'removeOrder',
    description: 'Delete the order',
  })
  @UseGuards(JwtAuthGuard)
  removeOrder(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ): Promise<Order> {
    return this.ordersService.remove(id);
  }

  @Subscription(() => Order, {
    name: 'newOrder',
    description: 'Subscribe to new orders',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewOrder(): AsyncIterator<Order> {
    return this.pubSub.asyncIterator('newOrder');
  }
}
