import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { EntityTarget, DataSource } from 'typeorm';
import { TypeOrmRepository } from './typeorm.repository';

export const TypeOrmRepositoryFactory = <D, P>(
  token: string,
  entity: EntityTarget<P>,
  mapper: IEntityMapper<D, P>,
) => ({
  provide: token,
  useFactory: (ds: DataSource) =>
    new TypeOrmRepository<D, P>(entity, ds, mapper),
  inject: [DataSource],
});
