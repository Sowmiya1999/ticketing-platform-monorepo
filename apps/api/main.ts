import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  console.log(`Server running on port ${port}`);
}

bootstrap();
