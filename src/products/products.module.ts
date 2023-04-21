import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Entity
import { Product } from './entities/product.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product])
  ]
})
export class ProductsModule { }
