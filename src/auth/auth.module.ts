import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
// Auth Jwt
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
// Service
import { AuthService } from './auth.service';
// Resolver
import { AuthResolver } from './auth.resolver';
// Module
import { UsersModule } from 'src/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy, {
    provide: 'PUB_SUB',
    useValue: new PubSub(),
  }],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
  imports: [
    ConfigModule,
    // Passport & JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET')
        }
      }
    }),
    MailModule,
    forwardRef(() => UsersModule)
  ]
})
export class AuthModule { }
