import { Module, forwardRef } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesResolver } from './companies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { PubSub } from 'graphql-subscriptions';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  providers: [
    CompaniesResolver,
    CompaniesService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UsersModule),
    MailModule,
  ],
  exports: [CompaniesService, TypeOrmModule],
})
export class CompaniesModule {}
