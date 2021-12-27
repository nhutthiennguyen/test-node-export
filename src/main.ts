import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3333, () =>
    Logger.log(`==== App listening on port ${3333} ====`),
  );
}
bootstrap();
