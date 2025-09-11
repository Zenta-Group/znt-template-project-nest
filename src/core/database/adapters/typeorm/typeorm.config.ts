import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GenericEntity } from './entities/generic.entity';
import { PersonEntity } from './entities/person.entity';
import { ConfirmationEntity } from './entities/confirmation.entity';
import { MessageEntity } from './entities/message.entity';

export function createTypeOrmOptions(
  configService: ConfigService,
): DataSourceOptions {
  return {
    type: 'mysql',
    host: configService.get<string>('database.host', 'localhost'),
    port: configService.get<number>('database.port', 3306),
    username: configService.get<string>('database.user', 'root'),
    password: configService.get<string>('database.password', 'root'),
    database: configService.get<string>('database.name', 'appdb'),
    entities: [GenericEntity, PersonEntity, ConfirmationEntity, MessageEntity],
    synchronize: false,
    logging: false,
    connectTimeout: 10000, // 10 segundos
    acquireTimeout: 10000, // 10 segundos
    extra: {
      connectionLimit: 10,
      idleTimeout: 600000, // 10 minutos
      acquireTimeout: 10000, // 10 segundos
    },
  };
}
