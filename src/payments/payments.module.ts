import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsResolver } from './payments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';

@Module({
  providers: [PaymentsResolver, PaymentsService],
  imports: [TypeOrmModule.forFeature([Payment])]
})
export class PaymentsModule { }
