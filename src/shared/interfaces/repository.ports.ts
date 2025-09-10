export type Primitive = string | number | boolean | Date | null;

export type Comparator<V = Primitive> = {
  eq?: V;
  ne?: V;
  gt?: V;
  gte?: V;
  lt?: V;
  lte?: V;
  in?: V[];
  nin?: V[];
  between?: [V, V];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  arrayContains?: Primitive;
  exists?: boolean;
};

export type Filter<P> = Partial<{
  [K in keyof P]:
    | Primitive
    | Comparator<P[K] extends Primitive ? P[K] : Primitive>;
}> & {
  $and?: Filter<P>[];
  $or?: Filter<P>[];
  $not?: Filter<P>;
};

export type OrderBy<P> = Partial<Record<keyof P, 'asc' | 'desc'>>;
export type Projection<P> = (keyof P)[];

export type Pagination = {
  limit?: number;
  offset?: number; // SQL
  cursor?: string; // NoSQL
  direction?: 'next' | 'prev';
};

export type QueryOptions<P> = {
  filter?: Filter<P>;
  order?: OrderBy<P>;
  select?: Projection<P>;
  include?: Record<string, boolean | { select?: string[] }>;
  includeDeleted?: boolean;
  pagination?: Pagination;
  index?: string; // GSI / índice compuesto si aplica (Dynamo/Firestore)
};

export interface Page<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
  cursorNext?: string;
  cursorPrev?: string;
}

export interface IEntityMapper<D, P> {
  toDomain(p: P): D;
  toPersistence(d: D): P;
}

export interface ISpecification<P> {
  toFilter(): Filter<P>;
}

export type RepoCapabilities = {
  supportsOffsetPagination: boolean;
  supportsCursorPagination: boolean;
  supportsTextSearchLike: boolean;
  supportsArrayContains: boolean;
  supportsTransactions: boolean;
  supportsSoftDelete: boolean;
};

export interface TransactionCtx {
  driverTx: unknown;
}
export interface RepoCtx {
  tx?: TransactionCtx;
  driverCtx?: unknown;
}

export interface IUnitOfWork {
  runInTransaction<T>(fn: (ctx: RepoCtx) => Promise<T>): Promise<T>;
  readonly capabilities: RepoCapabilities;
}

export interface IBaseRepository<D, P, ID = string> {
  readonly capabilities: RepoCapabilities;

  create(entity: D, ctx?: RepoCtx): Promise<D>;
  createWithId(id: ID, entity: D, ctx?: RepoCtx): Promise<D>;
  upsert(id: ID, entity: D, ctx?: RepoCtx): Promise<D>;
  findById(id: ID, ctx?: RepoCtx): Promise<D | null>;
  findOne(
    q?: QueryOptions<P> | ISpecification<P>,
    ctx?: RepoCtx,
  ): Promise<D | null>;
  findMany(q?: QueryOptions<P>, ctx?: RepoCtx): Promise<Page<D>>;
  update(id: ID, patch: Partial<D>, ctx?: RepoCtx): Promise<D>;
  delete(id: ID, opts?: { hard?: boolean }, ctx?: RepoCtx): Promise<void>;
}
