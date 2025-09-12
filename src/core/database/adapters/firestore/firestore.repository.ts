import {
  Firestore,
  CollectionReference,
  Query,
  Transaction,
} from '@google-cloud/firestore';
import {
  IBaseRepository,
  IEntityMapper,
  Page,
  QueryOptions,
  RepoCapabilities,
  RepoCtx,
  Filter,
  ISpecification,
} from 'src/shared/interfaces/repository.ports';

type FirestoreOptions<P> = {
  collectionName: string;
  idField?: keyof P; // default 'id'
};

export class FirestoreRepository<
  D,
  P extends { id?: ID },
  ID extends string = string,
> implements IBaseRepository<D, P, ID>
{
  constructor(
    private readonly db: Firestore,
    private readonly opts: FirestoreOptions<P>,
    private readonly mapper: IEntityMapper<D, P>,
  ) {}

  readonly capabilities: RepoCapabilities = {
    supportsOffsetPagination: false,
    supportsCursorPagination: true,
    supportsTextSearchLike: false,
    supportsArrayContains: true,
    supportsTransactions: true,
    supportsSoftDelete: false,
  };

  private col(): CollectionReference {
    return this.db.collection(this.opts.collectionName);
  }
  private tx(ctx?: RepoCtx): Transaction | undefined {
    return (ctx?.driverCtx as any)?.tx as Transaction | undefined;
  }

  private normalizeQuery(
    q?: QueryOptions<P> | ISpecification<P>,
  ): QueryOptions<P> {
    if (!q) return {};
    if ('toFilter' in q && typeof q.toFilter === 'function')
      return { filter: q.toFilter() };
    return q as QueryOptions<P>;
  }

  private applyFilter(q: Query, f?: Filter<P>): Query {
    if (!f) return q;

    for (const [k, v] of Object.entries(f)) {
      if (this.isLogicalOperator(k)) continue;
      q = this.applyFieldFilter(q, k, v);
    }

    return q;
  }

  private isLogicalOperator(key: string): boolean {
    return key === '$and' || key === '$or' || key === '$not';
  }

  private applyFieldFilter(q: Query, k: string, v: any): Query {
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      return this.applyComplexFilter(q, k, v);
    } else {
      return q.where(k, '==', v);
    }
  }

  private applyComplexFilter(q: Query, k: string, c: any): Query {
    if ('eq' in c) q = q.where(k, '==', c.eq);
    if ('ne' in c) q = q.where(k, '!=', c.ne);
    if ('gt' in c) q = q.where(k, '>', c.gt);
    if ('gte' in c) q = q.where(k, '>=', c.gte);
    if ('lt' in c) q = q.where(k, '<', c.lt);
    if ('lte' in c) q = q.where(k, '<=', c.lte);
    if ('between' in c) {
      q = q.where(k, '>=', c.between[0]).where(k, '<=', c.between[1]);
    }
    if ('in' in c) q = q.where(k, 'in', c.in);
    if ('nin' in c) q = q.where(k, 'not-in', c.nin);
    if ('arrayContains' in c) q = q.where(k, 'array-contains', c.arrayContains);
    if ('startsWith' in c) {
      const start = String(c.startsWith);
      const end = start + '\uf8ff';
      q = q.where(k, '>=', start).where(k, '<=', end);
    }
    return q;
  }

  private applyOrder(q: Query, order?: Record<string, 'asc' | 'desc'>): Query {
    if (!order) return q;
    for (const [k, dir] of Object.entries(order)) {
      q = q.orderBy(k, dir === 'asc' ? 'asc' : 'desc');
    }
    return q;
  }

  private async docFromId(id: string) {
    const ref = this.col().doc(id);
    const snap = await ref.get();
    return snap.exists ? snap : undefined;
  }

  async create(entity: D, ctx?: RepoCtx): Promise<D> {
    const data = this.mapper.toPersistence(entity) as any;
    const col = this.col();
    const t = this.tx(ctx);
    if (t) {
      const ref = col.doc();
      data.id ??= ref.id;
      t.set(ref, data);
      return this.mapper.toDomain({ ...data, id: ref.id });
    } else {
      const ref = col.doc(data.id ?? undefined);
      if (ref.id === data.id) {
        await ref.set(data);
        return this.mapper.toDomain({ ...data, id: ref.id });
      }
      const added = await col.add(data);
      const snap = await added.get();
      return this.mapper.toDomain({ id: added.id, ...(snap.data() as any) });
    }
  }

  async createWithId(id: ID, entity: D, ctx?: RepoCtx): Promise<D> {
    const data = this.mapper.toPersistence({ ...(entity as any), id }) as any;
    const ref = this.col().doc(String(id));
    const t = this.tx(ctx);
    if (t) {
      t.set(ref, data);
      return this.mapper.toDomain({ ...data, id });
    }
    await ref.set(data);
    return this.mapper.toDomain({ ...data, id });
  }

  async upsert(id: ID, entity: D, ctx?: RepoCtx): Promise<D> {
    const data = this.mapper.toPersistence({ ...(entity as any), id }) as any;
    const ref = this.col().doc(String(id));
    const t = this.tx(ctx);
    if (t) {
      t.set(ref, data, { merge: true });
      return this.mapper.toDomain({ ...data, id });
    }
    await ref.set(data, { merge: true });
    const snap = await ref.get();
    return this.mapper.toDomain({ id, ...(snap.data() as any) });
  }

  async findById(id: ID, _ctx?: RepoCtx) {
    const snap = await this.col().doc(String(id)).get();
    if (!snap.exists) return null;
    return this.mapper.toDomain({ id, ...(snap.data() as any) });
  }

  async findOne(q?: QueryOptions<P> | ISpecification<P>, _ctx?: RepoCtx) {
    const { filter, order, select } = this.normalizeQuery(q);
    let query: Query = this.col();
    query = this.applyFilter(query, filter);
    query = this.applyOrder(query, order as any);
    if (select?.length) query = (query as any).select(...(select as string[]));
    query = query.limit(1);
    const snap = await query.get();
    const doc = snap.docs[0];
    if (!doc) return null;
    return this.mapper.toDomain({ id: doc.id, ...(doc.data() as any) });
  }

  async findMany(q?: QueryOptions<P>, _ctx?: RepoCtx): Promise<Page<D>> {
    const { filter, order, select, pagination } = q ?? {};
    let query: Query = this.col();

    query = this.applyFilter(query, filter);
    query = this.applyOrder(query, order as any);
    if (select?.length) query = (query as any).select(...(select as string[]));

    // Paginación por cursor (id del último doc de la página anterior)
    if (pagination?.cursor) {
      const cur = await this.docFromId(pagination.cursor);
      if (cur) query = query.startAfter(cur);
    }
    if (pagination?.limit) query = query.limit(pagination.limit);

    const snap = await query.get();
    const rows = snap.docs.map((d) =>
      this.mapper.toDomain({ id: d.id, ...(d.data() || {}) } as P),
    );
    const last = snap.docs[snap.docs.length - 1];
    return { data: rows, limit: pagination?.limit, cursorNext: last?.id };
  }

  async update(id: ID, patch: Partial<D>): Promise<D> {
    const ref = this.col().doc(String(id));
    await ref.set(this.mapper.toPersistence(patch as D) as any, {
      merge: true,
    });
    const snap = await ref.get();
    if (!snap.exists) throw new Error(`Not found ${String(id)}`);
    return this.mapper.toDomain({ id, ...(snap.data() as any) });
  }

  async delete(id: ID): Promise<void> {
    await this.col().doc(String(id)).delete();
  }
}
