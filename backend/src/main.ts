import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  if (process.env.TRUST_PROXY)
    app.set(
      'trust proxy',
      process.env.TRUST_PROXY === 'true' ? 1 : process.env.TRUST_PROXY,
    );
  app.disable('x-powered-by');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip unknown properties
      forbidNonWhitelisted: true,
      transform: true, // apply @Type() coercions (e.g. query string -> number)
    }),
  );

  const origins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (!origins.length && process.env.NODE_ENV === 'production')
    throw new Error('FRONTEND_URL must be set in production (CORS allow-list)');
  app.enableCors(
    origins.length ? { origin: origins, credentials: true } : undefined,
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Oct20Five API')
    .setDescription('Users & RBAC module')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`API running on http://localhost:${port}/api`);
  console.log(`Swagger docs on http://localhost:${port}/api/docs`);
}
bootstrap();
