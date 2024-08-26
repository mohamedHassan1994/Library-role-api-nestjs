/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as mongoSanitize from 'express-mongo-sanitize';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  // Apply mongoSanitize as a transformation step
  app.useGlobalInterceptors({
    intercept(context, next) {
      const request = context.switchToHttp().getRequest();
      mongoSanitize.sanitize(request.body, {
        replaceWith: '_',
        allowDots: true,
      });
      return next.handle();
    },
  });

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
}

bootstrap();
