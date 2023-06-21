import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';

@Module({
  providers: [CompaniesResolver, CompaniesService],
  imports: [TypeOrmModule.forFeature([Company])],
  exports: [CompaniesService, TypeOrmModule]
})
export class CompaniesModule { }
