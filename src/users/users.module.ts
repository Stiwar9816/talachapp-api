import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';
import { PubSub } from 'graphql-subscriptions';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
  providers: [
    UsersResolver,
    UsersService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    forwardRef(() => CompaniesModule),
    forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
