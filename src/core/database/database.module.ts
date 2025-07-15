import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirestoreRepository } from './firestore.repository';
import { User } from 'src/shared/entities/user.entity';
import { CsrfToken } from 'src/shared/entities/csrf-token.entity';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'USER_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        return new FirestoreRepository<User>(configService, {
          collectionName: 'users',
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'CSRF_TOKEN_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        return new FirestoreRepository<CsrfToken>(configService, {
          collectionName: 'csrfTokens',
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'GENERIC_REPOSITORY',
      useFactory: (configService: ConfigService) => {
        return new FirestoreRepository<User>(configService, {
          collectionName: 'generics',
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['USER_REPOSITORY', 'GENERIC_REPOSITORY', 'CSRF_TOKEN_REPOSITORY'],
})
export class DatabaseModule {}
