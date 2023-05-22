import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true
    }),
  );
  // app.enableCors({
  //   origin: 'https://talachappweb.netlify.app/',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   preflightContinue: false,
  //   optionsSuccessStatus: 204,
  //   credentials: true,
  //   allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  // });
  app.enableCors({
    origin: '*', // Cambia esto a tu dominio permitido
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  });
  await app.listen(process.env.PORT);
  logger.log(`App runnig on port ${process.env.PORT}`);
}
bootstrap();
