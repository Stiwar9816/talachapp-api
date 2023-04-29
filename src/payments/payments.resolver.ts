import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentInput } from './dto/inputs/create-payment.input';
import { UpdatePaymentInput } from './dto/inputs/update-payment.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Payment)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Mutation(() => Payment, { name: 'createPayment' })
  createPayment(@Args('createPaymentInput') createPaymentInput: CreatePaymentInput) {
    return this.paymentsService.create(createPaymentInput);
  }

  @Query(() => [Payment], { name: 'payments' })
  findAll() {
    return this.paymentsService.findAll();
  }

  @Query(() => Payment, { name: 'payment' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.paymentsService.findOne(id);
  }

  @Mutation(() => Payment, { name: 'updatePayment' })
  updatePayment(@Args('updatePaymentInput') updatePaymentInput: UpdatePaymentInput) {
    return this.paymentsService.update(updatePaymentInput.id, updatePaymentInput);
  }

  @Mutation(() => Payment, { name: 'removePaymnet' })
  removePayment(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.paymentsService.remove(id);
  }
}
