export interface IIntegrationService<T> {
  //get(endpoint: string, params?: Record<string, any>): Promise<T>;
  get<T>(endpoint: string, params?: Record<string, any>, responseType?: any): Promise<T>;
  post<T>(endpoint: string, data: any): Promise<T>;
  put<T>(endpoint: string, data: any): Promise<T>;
  delete(endpoint: string): Promise<void>;
  postFormData<T>(endpoint: string, formData: FormData): Promise<T>;
  downloadFile(endpoint: string): Promise<{ buffer: Buffer; fileName: string }>;
}
