import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomLogger } from './core/logger/custom-logger';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
  });

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  app.enableCors({
    origin: [configService.get('listCors')],
    credentials: true,
  });
  app.setGlobalPrefix('api/v1/zenta');

  const config = new DocumentBuilder()
    .setTitle('Template Nest Zenta')
    .setDescription('Ejemplo de template para NestJS a utilizar en Zenta.')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      { type: 'apiKey', name: 'x-csrf-token', in: 'header' },
      'x-csrf-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/zenta/swagger-doc', app, document);
  logger.log(
    `Swagger running on http://localhost:${port}/api/v1/zenta/swagger-doc`,
  );

  await app.listen(port, () => {
    logger.log(`App corriendo en http://localhost:${port}`);
  });
}
bootstrap();
