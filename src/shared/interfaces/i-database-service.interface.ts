export interface IDatabaseService<T> {
  create(id: string, data: T): Promise<T>;
  createOrReplace(id: string, data: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getByField(field: string, value: string): Promise<T | null>;
  getAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
