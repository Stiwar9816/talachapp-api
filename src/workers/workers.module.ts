import { Module } from '@nestjs/common';
import { WorkersService } from './workers.service';
import { WorkersResolver } from './workers.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { Worker } from './entities/worker.entity';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  providers: [
    WorkersResolver,
    WorkersService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [TypeOrmModule.forFeature([Worker]), CompaniesModule],
  exports: [WorkersService, TypeOrmModule],
})
export class WorkersModule {}
