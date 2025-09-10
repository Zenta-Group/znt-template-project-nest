import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { User } from 'src/shared/models/user.model';

export type UserDoc = {
  id: string;
  name: string;
  lastname: string;
  username: string;
  documentId: string;
  email: string;
  password: string;
  status: boolean;
  role?: string;
};

export const UserFirestoreMapper: IEntityMapper<User, UserDoc> = {
  toDomain(p: UserDoc): User {
    return {
      id: p.id,
      email: p.email,
      name: p.name,
      lastname: p.lastname,
      username: p.username,
      documentId: p.documentId,
      password: p.password,
      status: p.status,
      role: p.role,
    } as User;
  },
  toPersistence(d: User): UserDoc {
    return {
      id: String(d.id ?? ''),
      email: d.email,
      name: d.name,
      lastname: d.lastname,
      username: d.username,
      documentId: d.documentId,
      password: d.password,
      status: d.status,
      role: d.role,
    };
  },
};
