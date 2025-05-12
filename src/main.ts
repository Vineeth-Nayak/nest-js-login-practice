import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HTTPExceptionsFilter } from './filters/http-exception';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationPipe } from './pipes/i18n-validation';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const i18n = app.get<I18nService<Record<string, unknown>>>(I18nService);

  app.useGlobalPipes(new I18nValidationPipe(i18n));

  app.useGlobalFilters(new HTTPExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
