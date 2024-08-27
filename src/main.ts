/* eslint-disable prettier/prettier */
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';
import * as mongoSanitize from 'express-mongo-sanitize';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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
  const config = new DocumentBuilder()
    .setTitle('Free Library')
    .setDescription('Check out all new books')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http', // Specifies that this is an HTTP authentication scheme
        scheme: 'bearer', // Specifies that it's a Bearer token
        bearerFormat: 'JWT', // Optional, specifies the format (like JWT)
        description:
          'Please enter your JWT token in the format: Bearer <token>',
      },
      'access-token', // Optional name of the security scheme
    )
    // .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1', app, document);

  const PORT = process.env.PORT || 4000;
  await app.listen(PORT);
}

bootstrap();
