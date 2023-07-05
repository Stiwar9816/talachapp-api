import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesResolver } from './prices.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Price } from './entities/price.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [PricesResolver, PricesService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  imports: [TypeOrmModule.forFeature([Price])],
  exports: [PricesService, TypeOrmModule]
})
export class PricesModule { }