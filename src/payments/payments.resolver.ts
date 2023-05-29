import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Service
import { PaymentsService } from './payments.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// Entity/Dto's(Inputs)
import { CreatePaymentInput } from './dto';
import { Payment } from './entities/payment.entity';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Payment)
@UseGuards(JwtAuthGuard)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Mutation(() => Payment, {
    name: 'createPayment',
    description: 'Create a new payment'
  })
  createPayment(
    @Args('createPaymentInput') createPaymentInput: CreatePaymentInput,
    @CurrentUser() user: User
  ) {
    return this.paymentsService.create(createPaymentInput);
  }

  @Query(() => [Payment], {
    name: 'payments',
    description: 'Find all payments'
  })
  findAll(@CurrentUser() user: User) {
    return this.paymentsService.findAll();
  }

  @Query(() => Payment, {
    name: 'payment',
    description: 'Search for a single payment by payment ID'
  })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser() user: User
  ) {
    return this.paymentsService.findOne(id);
  }
}
