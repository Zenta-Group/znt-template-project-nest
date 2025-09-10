import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { ConfirmationEntity } from './entities/confirmation.entity';
import { GenericEntity } from './entities/generic.entity';
import { MessageEntity } from './entities/message.entity';
import { PersonEntity } from './entities/person.entity';
import { confirmationMapper } from './mappers/confirmation.mapper';
import { GenericTypeOrmMapper } from './mappers/generic.mapper';
import { messageMapper } from './mappers/message.mapper';
import { personMapper } from './mappers/person.mapper';
import { createTypeOrmOptions } from './typeorm.config';
import { TypeOrmRepositoryFactory } from './typeorm.factory';
import { TypeOrmUnitOfWork } from './typeorm.uow';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    NestTypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createTypeOrmOptions,
    }),
  ],
  providers: [
    // UoW
    {
      provide: 'UOW_TYPEORM',
      useFactory: (ds: DataSource) => new TypeOrmUnitOfWork(ds),
      inject: [DataSource],
    },

    TypeOrmRepositoryFactory(
      'GENERIC_REPOSITORY',
      GenericEntity,
      GenericTypeOrmMapper,
    ),

    TypeOrmRepositoryFactory(
      'CONFIRMATION_REPO',
      ConfirmationEntity,
      confirmationMapper,
    ),
    TypeOrmRepositoryFactory('MESSAGE_REPO', MessageEntity, messageMapper),
    TypeOrmRepositoryFactory('PERSON_REPO', PersonEntity, personMapper),
  ],
  exports: [
    'UOW_TYPEORM',
    'GENERIC_REPOSITORY',
    'CONFIRMATION_REPO',
    'MESSAGE_REPO',
    'PERSON_REPO',
  ],
})
export class TypeOrmModule {}
