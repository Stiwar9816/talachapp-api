import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesResolver } from './prices.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  providers: [PricesResolver, PricesService],
  imports: [TypeOrmModule.forFeature([Price])],
  exports: [PricesService, TypeOrmModule]
})
export class PricesModule { }
