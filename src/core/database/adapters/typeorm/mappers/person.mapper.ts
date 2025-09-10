import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { Person } from 'src/shared/models/person.model';
import { PersonEntity, PersonRole } from '../entities/person.entity';

export const personMapper: IEntityMapper<Person, PersonEntity> = {
  toDomain(p: PersonEntity): Person {
    return {
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      status: p.status,
    };
  },
  toPersistence(d: Person): PersonEntity {
    return {
      id: d.id,
      name: d.name,
      email: d.email,
      role: d.role as PersonRole,
      status: d.status,
    } as PersonEntity;
  },
};
