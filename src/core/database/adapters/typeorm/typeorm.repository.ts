import {
  DataSource,
  EntityManager,
  EntityTarget,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
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

type IdLike = string | number;

export class TypeOrmRepository<
  D,
  P extends { id?: ID },
  ID extends IdLike = string,
> implements IBaseRepository<D, P, ID>
{
  constructor(
    private readonly entity: EntityTarget<P>,
    private readonly ds: DataSource,
    private readonly mapper: IEntityMapper<D, P>,
  ) {}

  readonly capabilities: RepoCapabilities = {
    supportsOffsetPagination: true,
    supportsCursorPagination: false,
    supportsTextSearchLike: true,
    supportsArrayContains: false,
    supportsTransactions: true,
    supportsSoftDelete: true,
  };

  private repo(m?: EntityManager): Repository<P> {
    const manager = m ?? this.ds.manager;
    return manager.getRepository(this.entity);
  }
  private getManager(ctx?: RepoCtx): EntityManager | undefined {
    return (ctx?.driverCtx as any)?.manager as EntityManager | undefined;
  }

  private normalizeQuery(
    q?: QueryOptions<P> | ISpecification<P>,
  ): QueryOptions<P> {
    if (!q) return {};
    if ('toFilter' in q && typeof q.toFilter === 'function')
      return { filter: q.toFilter() };
    return q as QueryOptions<P>;
  }

  // Traducción simple de Filter -> QB (cubre los casos más comunes)
  private applyFilter(qb: SelectQueryBuilder<P>, alias: string, f?: Filter<P>) {
    if (!f) return;
    const ands: string[] = [];
    const params: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(f)) {
      if (k.startsWith('$')) continue;
      this.applyFieldFilter(ands, params, alias, k, v);
    }

    this.applyLogicalFilters(f, ands, params, alias);

    if (ands.length) qb.andWhere(ands.join(' AND '), params);
  }

  private applyFieldFilter(
    ands: string[],
    params: Record<string, unknown>,
    alias: string,
    k: string,
    v: any,
  ) {
    const col = `${alias}.${k}`;
    const kp = (s: string) => `${k}_${s}_${ands.length}`;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      const c = v;
      if ('eq' in c)
        this.pushFilter(ands, params, `${col} = :${kp('eq')}`, kp('eq'), c.eq);
      if ('ne' in c)
        this.pushFilter(ands, params, `${col} <> :${kp('ne')}`, kp('ne'), c.ne);
      if ('gt' in c)
        this.pushFilter(ands, params, `${col} > :${kp('gt')}`, kp('gt'), c.gt);
      if ('gte' in c)
        this.pushFilter(
          ands,
          params,
          `${col} >= :${kp('gte')}`,
          kp('gte'),
          c.gte,
        );
      if ('lt' in c)
        this.pushFilter(ands, params, `${col} < :${kp('lt')}`, kp('lt'), c.lt);
      if ('lte' in c)
        this.pushFilter(
          ands,
          params,
          `${col} <= :${kp('lte')}`,
          kp('lte'),
          c.lte,
        );
      if ('between' in c) {
        ands.push(`${col} BETWEEN :${kp('b0')} AND :${kp('b1')}`);
        params[kp('b0')] = c.between[0];
        params[kp('b1')] = c.between[1];
      }
      if ('in' in c) {
        ands.push(`${col} IN (:...${kp('in')})`);
        params[kp('in')] = c.in;
      }
      if ('nin' in c) {
        ands.push(`${col} NOT IN (:...${kp('nin')})`);
        params[kp('nin')] = c.nin;
      }
      if ('contains' in c)
        this.pushFilter(
          ands,
          params,
          `${col} LIKE :${kp('contains')}`,
          kp('contains'),
          `%${c.contains}%`,
        );
      if ('startsWith' in c)
        this.pushFilter(
          ands,
          params,
          `${col} LIKE :${kp('sw')}`,
          kp('sw'),
          `${c.startsWith}%`,
        );
      if ('endsWith' in c)
        this.pushFilter(
          ands,
          params,
          `${col} LIKE :${kp('ew')}`,
          kp('ew'),
          `%${c.endsWith}`,
        );
      if ('exists' in c)
        ands.push(`${col} IS ${c.exists ? 'NOT NULL' : 'NULL'}`);
    } else {
      this.pushFilter(ands, params, `${col} = :${kp('eqp')}`, kp('eqp'), v);
    }
  }

  private pushFilter(
    ands: string[],
    params: Record<string, unknown>,
    sql: string,
    key: string,
    value: unknown,
  ) {
    ands.push(sql);
    params[key] = value;
  }

  private applyLogicalFilters(
    f: Filter<P>,
    ands: string[],
    params: Record<string, unknown>,
    alias: string,
  ) {
    if (f.$and?.length) {
      f.$and.forEach((sf) => {
        const sub = this.repo().createQueryBuilder(alias);
        this.applyFilter(sub, alias, sf);
        const [, prms] = sub.getQueryAndParameters();
        Object.assign(params, prms[0] ?? {});
        const subConds = sub.expressionMap.wheres
          .map((w) => {
            if (typeof w.condition === 'string') return w.condition;
            if (
              w.condition &&
              typeof w.condition === 'object' &&
              'toString' in w.condition
            ) {
              return w.condition.toString();
            }
            return JSON.stringify(w.condition) || '';
          })
          .join(' AND ');
        ands.push(`(${subConds})`);
      });
    }
    if (f.$or?.length) {
      const parts: string[] = [];
      f.$or.forEach((sf) => {
        const sub = this.repo().createQueryBuilder(alias);
        this.applyFilter(sub, alias, sf);
        const subConds = sub.expressionMap.wheres
          .map((w) => {
            if (typeof w.condition === 'string') return w.condition;
            if (
              w.condition &&
              typeof w.condition === 'object' &&
              'toString' in w.condition
            ) {
              return w.condition.toString();
            }
            return JSON.stringify(w.condition) || '';
          })
          .join(' AND ');
        parts.push(`(${subConds})`);
      });
      if (parts.length) ands.push(`(${parts.join(' OR ')})`);
    }
    if (f.$not) {
      const sub = this.repo().createQueryBuilder(alias);
      this.applyFilter(sub, alias, f.$not);
      const subConds = sub.expressionMap.wheres
        .map((w) => {
          if (typeof w.condition === 'string') return w.condition;
          if (
            w.condition &&
            typeof w.condition === 'object' &&
            'toString' in w.condition
          ) {
            return w.condition.toString();
          }
          return JSON.stringify(w.condition) || '';
        })
        .join(' AND ');
      ands.push(`NOT (${subConds})`);
    }
  }

  async create(entity: D, ctx?: RepoCtx): Promise<D> {
    const r = this.repo(this.getManager(ctx));
    const saved = await r.save(r.create(this.mapper.toPersistence(entity)));
    return this.mapper.toDomain(saved);
  }
  async createWithId(id: ID, entity: D, ctx?: RepoCtx): Promise<D> {
    const r = this.repo(this.getManager(ctx));
    const p = this.mapper.toPersistence({ ...(entity as any), id });
    const saved = await r.save(r.create(p));
    return this.mapper.toDomain(saved);
  }
  async upsert(id: ID, entity: D, ctx?: RepoCtx): Promise<D> {
    const r = this.repo(this.getManager(ctx));
    const p = this.mapper.toPersistence({ ...(entity as any), id });
    await r.upsert(p as any, ['id']);
    const stored = await r.findOne({ where: { id } as any });
    if (!stored) throw new Error(`Not found ${String(id)}`);
    return this.mapper.toDomain(stored);
  }
  async findById(id: ID, ctx?: RepoCtx) {
    const r = this.repo(this.getManager(ctx));
    const row = await r.findOne({ where: { id } as any });
    return row ? this.mapper.toDomain(row) : null;
  }
  async findOne(q?: QueryOptions<P> | ISpecification<P>, ctx?: RepoCtx) {
    const r = this.repo(this.getManager(ctx));
    const qb = r.createQueryBuilder('t');
    const { filter, select } = this.normalizeQuery(q);
    if (select?.length) qb.select(select.map((c) => `t.${String(c)}`));
    this.applyFilter(qb, 't', filter);
    const row = await qb.getOne();
    return row ? this.mapper.toDomain(row) : null;
  }
  async findMany(q?: QueryOptions<P>, ctx?: RepoCtx): Promise<Page<D>> {
    const r = this.repo(this.getManager(ctx));
    const qb = r.createQueryBuilder('t');
    const { filter, order, select, pagination } = q ?? {};
    if (select?.length) qb.select(select.map((c) => `t.${String(c)}`));
    if (order)
      Object.entries(order).forEach(([k, dir]) =>
        qb.addOrderBy(`t.${k}`, (dir as any).toUpperCase()),
      );
    if (pagination?.limit != null) qb.take(pagination.limit);
    if (pagination?.offset != null) qb.skip(pagination.offset);
    this.applyFilter(qb, 't', filter);
    const [rows, total] = await qb.getManyAndCount();
    return {
      data: rows.map(this.mapper.toDomain),
      total,
      limit: pagination?.limit,
      offset: pagination?.offset,
    };
  }
  async update(id: ID, patch: Partial<D>, ctx?: RepoCtx): Promise<D> {
    const r = this.repo(this.getManager(ctx));
    const current = await r.findOne({ where: { id } as any });
    if (!current) throw new Error(`Not found ${String(id)}`);
    const merged = r.merge(current, this.mapper.toPersistence(patch as D));
    const saved = await r.save(merged);
    return this.mapper.toDomain(saved);
  }
  async delete(
    id: ID,
    _opts?: { hard?: boolean },
    ctx?: RepoCtx,
  ): Promise<void> {
    const r = this.repo(this.getManager(ctx));
    await r.delete({ id } as any);
  }
}
