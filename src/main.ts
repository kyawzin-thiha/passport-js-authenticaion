import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ORIGIN || true,
    credentials: true,
  });
  app.use(cookieParser(process.env.COOKIE_SECRET || '1234'));
  app.use(helmet());
  await app.listen(process.env.PORT || 3001, () =>
    console.log(`app is running in port ${process.env.PORT || 3001}`),
  );
}
bootstrap();
