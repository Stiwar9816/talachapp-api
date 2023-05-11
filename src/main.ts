import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule);
  // app.enableCors(); // Configuración opcional
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // forbidNonWhitelisted: true
    })
  )

  await app.listen(process.env.PORT);
  logger.log(`App runnig on port ${process.env.PORT}`)
}
bootstrap();
