import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// TypeORM
import { TypeOrmModule } from '@nestjs/typeorm';
// Modules
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    // Configuración de credenciales de la DB
    TypeOrmModule.forRoot({
      ssl: process.env.STAGE === 'prod',
      extra: {
        ssl: process.env.STAGE === 'prod'
          ? { rejectUnauthorized: false }
          : null
      },
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true
    }),
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
