import { Firestore } from '@google-cloud/firestore';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirestoreRepositoryFactory } from './firestore.factory';
import { createFirestoreProvider } from './firestore.provider';
import { FirestoreUnitOfWork } from './firestore.uow';
import { CsrfFirestoreMapper } from './mappers/csrf.mapper';
import { UserFirestoreMapper } from './mappers/user.mapper';

@Module({
  imports: [ConfigModule],
  providers: [
    createFirestoreProvider(
      'FIRESTORE_AUTH',
      'gcpProjectId',
      'gcpFirestoreDatabaseId',
    ),

    {
      provide: 'UOW_FIRESTORE',
      useFactory: (fs: Firestore) => new FirestoreUnitOfWork(fs),
      inject: ['FIRESTORE_AUTH'],
    },

    FirestoreRepositoryFactory(
      'USER_REPOSITORY',
      'usuarios',
      UserFirestoreMapper,
      'FIRESTORE_AUTH',
    ),
    FirestoreRepositoryFactory(
      'CSRF_TOKEN_REPOSITORY',
      'csrfTokens',
      CsrfFirestoreMapper,
      'FIRESTORE_AUTH',
    ),
  ],
  exports: ['UOW_FIRESTORE', 'USER_REPOSITORY', 'CSRF_TOKEN_REPOSITORY'],
})
export class FirestoreModule {}
