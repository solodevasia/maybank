import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT ?? 4000

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1/');
  await app.listen(port, () => {
    console.log(`Application Running on http://localhost:${port}`)
  });
}
bootstrap();
