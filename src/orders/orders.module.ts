import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { PricesModule } from '../prices/prices.module';

@Module({
  providers: [OrdersResolver, OrdersService],
  imports: [TypeOrmModule.forFeature([Order]),PricesModule]
})
export class OrdersModule { }
