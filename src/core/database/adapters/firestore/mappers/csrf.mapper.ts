import { IEntityMapper } from 'src/shared/interfaces/repository.ports';
import { CsrfToken } from 'src/shared/models/csrf-token.model';

export type CsrfDoc = {
  id: string;
  token: string;
  createdAt: FirebaseFirestore.Timestamp | Date;
};

export const CsrfFirestoreMapper: IEntityMapper<CsrfToken, CsrfDoc> = {
  toDomain(p: CsrfDoc): CsrfToken {
    return {
      id: p.id,
      token: p.token,
      createdAt:
        p.createdAt instanceof Date ? p.createdAt : p.createdAt.toDate(),
    };
  },
  toPersistence(d: CsrfToken): CsrfDoc {
    return {
      id: String(d.id ?? ''),
      token: d.token,
      createdAt: d.createdAt,
    };
  },
};
