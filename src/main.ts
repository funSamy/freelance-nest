import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use(
    compression({
      threshold: 100,
      filter(req, res) {
        if (req.headers['x-disable-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
