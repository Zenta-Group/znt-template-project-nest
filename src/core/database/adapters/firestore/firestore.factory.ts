import { Firestore } from '@google-cloud/firestore';
import { FirestoreRepository } from './firestore.repository';
import { IEntityMapper } from 'src/shared/interfaces/repository.ports';

export function FirestoreRepositoryFactory<D, P>(
  token: string,
  collectionName: string,
  mapper: IEntityMapper<D, P>,
  firestoreProviderToken: string | symbol = 'Firestore',
) {
  return {
    provide: token,
    useFactory: (fs: Firestore) =>
      new FirestoreRepository<D, P, string>(fs, { collectionName }, mapper),
    inject: [firestoreProviderToken],
  };
}
