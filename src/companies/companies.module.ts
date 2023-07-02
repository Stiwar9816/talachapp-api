import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [CompaniesResolver, CompaniesService, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  imports: [TypeOrmModule.forFeature([Company])],
  exports: [CompaniesService, TypeOrmModule]
})
export class CompaniesModule { }
