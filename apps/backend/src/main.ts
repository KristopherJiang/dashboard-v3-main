// Prisma $queryRaw 返回 BigInt，JSON.stringify 无法序列化
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (typeof BigInt.prototype.toJSON !== 'function') {
  BigInt.prototype.toJSON = function (this: bigint) {
    return Number(this);
  };
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors();

  await app.listen(3000);
  console.log('[NestJS] Server running on http://localhost:3000');
}
bootstrap();
