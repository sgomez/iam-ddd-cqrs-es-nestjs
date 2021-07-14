import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.NODE_ENV == 'development'
        ? ['debug', 'error', 'log', 'verbose', 'warn']
        : ['log', 'error', 'warn'],
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('IAM API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options, {});
  SwaggerModule.setup(GLOBAL_PREFIX, app, document);

  const port = process.env.PORT || 3333;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + GLOBAL_PREFIX);
  });
}
bootstrap();
