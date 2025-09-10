import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { GenericEntity } from '../entities/generic.entity';
import { Generic } from 'src/shared/models/generic.model';

export const GenericTypeOrmMapper: IEntityMapper<Generic, GenericEntity> = {
  toDomain(p: GenericEntity): Generic {
    return {
      id: p.id,
      name: p.name,
      description: p.description,
      date: p.createdAt,
      status: p.status,
    };
  },
  toPersistence(d: Generic): GenericEntity {
    const e = new GenericEntity();
    e.id = String(d.id ?? '');
    e.name = d.name;
    e.description = d.description;
    e.createdAt = d.date;
    e.status = d.status;
    return e;
  },
};
