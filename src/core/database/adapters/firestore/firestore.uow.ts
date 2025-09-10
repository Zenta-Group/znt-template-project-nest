import { Firestore, Transaction } from '@google-cloud/firestore';
import {
  IUnitOfWork,
  RepoCapabilities,
  RepoCtx,
} from 'src/shared/interfaces/repository.ports';

export class FirestoreUnitOfWork implements IUnitOfWork {
  constructor(private readonly db: Firestore) {}

  readonly capabilities: RepoCapabilities = {
    supportsOffsetPagination: false,
    supportsCursorPagination: true,
    supportsTextSearchLike: false, // no LIKE real; sólo rangos / índices
    supportsArrayContains: true,
    supportsTransactions: true,
    supportsSoftDelete: false,
  };

  async runInTransaction<T>(fn: (ctx: RepoCtx) => Promise<T>): Promise<T> {
    return this.db.runTransaction(async (tx: Transaction) => {
      const ctx: RepoCtx = { tx: { driverTx: tx }, driverCtx: { tx } };
      return fn(ctx);
    });
  }
}
