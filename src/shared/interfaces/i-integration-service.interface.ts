export interface IIntegrationService<T> {
  get(endpoint: string, params?: Record<string, any>): Promise<T>;
  post(endpoint: string, data: any): Promise<T>;
  put(endpoint: string, data: any): Promise<T>;
  delete(endpoint: string): Promise<void>;
}
