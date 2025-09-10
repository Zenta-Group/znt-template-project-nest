import { DataSource, EntityManager } from 'typeorm';
import {
  IUnitOfWork,
  RepoCapabilities,
  RepoCtx,
} from 'src/shared/interfaces/repository.ports';

export class TypeOrmUnitOfWork implements IUnitOfWork {
  constructor(private readonly ds: DataSource) {}
  readonly capabilities: RepoCapabilities = {
    supportsOffsetPagination: true,
    supportsCursorPagination: false,
    supportsTextSearchLike: true,
    supportsArrayContains: false,
    supportsTransactions: true,
    supportsSoftDelete: true,
  };
  async runInTransaction<T>(fn: (ctx: RepoCtx) => Promise<T>): Promise<T> {
    return this.ds.transaction(async (em: EntityManager) => {
      const ctx: RepoCtx = { driverCtx: { manager: em }, tx: { driverTx: em } };
      return fn(ctx);
    });
  }
}
