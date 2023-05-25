import { join } from 'path';
// NestJS
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
// GraphQL
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
// Auth
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
// Modules
import { PricesModule } from './prices/prices.module';
import { CompaniesModule } from './companies/companies.module';
import { ScoresModule } from './scores/scores.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Configuración de credenciales de la DB
    TypeOrmModule.forRoot({
      type: 'postgres',
      ssl: (process.env.STATE === 'prod')
        ? {
          rejectUnauthorized: false,
          sslmode: 'require'
        } : false as any,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    // GraphQL
    // TODO: Configuración básica
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault()
      ]
    }),
    // TODO: Bloqueo de Schemas para usuarios no autenticados
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async (jwtService: JwtService) => ({
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     playground: false,
    //     plugins: [
    //       ApolloServerPluginLandingPageLocalDefault()
    //     ],
    //     context({ req }) {
    //       const token = req.headers.authorization?.replace('Bearer ', '')
    //       if (!token) throw Error('Token needed')

    //       const payload = jwtService.decode(token)
    //       if (!payload) throw Error('Token not valid')

    //     }
    //   })
    // }),
    AuthModule,
    CompaniesModule,
    OrdersModule,
    PaymentsModule,
    PricesModule,
    ScoresModule,
    UsersModule,
    MailModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
