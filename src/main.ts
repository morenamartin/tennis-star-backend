import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: [process.env.FRONTEND_URL],
    credentials: true, // Permite el intercambio de cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })

  await app.listen(process.env.PORT ?? 8080);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
