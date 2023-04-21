import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  const app = await NestFactory.create(AppModule);
  // app.enableCors(); // Configuración opcional
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('TalachAPP API')
    .setDescription('TalachApp endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('API', app, document);

  await app.listen(process.env.PORT);
  logger.log(`App runnig on port ${process.env.PORT}`)
}
bootstrap();
