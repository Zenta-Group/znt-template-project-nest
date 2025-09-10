import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from './core/logger/app.logger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import pino from 'pino';

function makePinoOptions(): pino.LoggerOptions & { transport?: any } {
  const isDev = process.env.NODE_ENV !== 'production';
  let transport: pino.TransportSingleOptions | undefined;

  if (isDev) {
    try {
      const prettyTarget = require.resolve('pino-pretty');
      transport = {
        target: prettyTarget,
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          singleLine: true,
          ignore: 'pid,hostname',
        },
      };
    } catch {}
  }

  return {
    level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
    redact: {
      paths: ['req.headers.authorization', 'password', 'token'],
      remove: true,
    },

    hooks: {
      logMethod(inputArgs, method) {
        const [obj] = inputArgs;
        if (
          obj &&
          typeof obj === 'object' &&
          ((obj as any).msg?.includes('incoming request') ||
            (obj as any).msg?.includes('request completed'))
        ) {
          return;
        }
        return method.apply(this, inputArgs);
      },
    },
    transport,
  };
}

async function bootstrap() {
  const prefix = 'api/v1/zenta';

  const pinoOpts = makePinoOptions();
  const adapter = new FastifyAdapter({
    logger: pinoOpts,
    disableRequestLogging: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  const fastifyLogger = app.getHttpAdapter().getInstance().log as pino.Logger;
  app.useLogger(new AppLogger(fastifyLogger));

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await enableCors(app, configService);
  app.setGlobalPrefix(prefix);

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
  SwaggerModule.setup(`${prefix}/swagger-doc`, app, document);

  fastifyLogger.info(
    `Swagger running on http://localhost:${port}/${prefix}/swagger-doc`,
  );

  await app.listen(port, '0.0.0.0');
  fastifyLogger.info(`App corriendo en http://localhost:${port}`);
}

async function enableCors(app, configService: ConfigService) {
  const cfg = configService.get<string>('listCors');
  if (!cfg) return;

  const corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'x-csrf-token',
    ],
    credentials: true,
  };

  if (cfg === '*') {
    app.enableCors(corsOptions);
  } else if (cfg.includes(',')) {
    const origins = cfg.split(',').map((url) => url.trim());
    app.enableCors({ ...corsOptions, origin: origins });
  } else {
    app.enableCors({ ...corsOptions, origin: cfg });
  }
}

bootstrap();
