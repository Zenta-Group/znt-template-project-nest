export enum SecurityType {
  NONE = 'none',
  API_KEY = 'api-key',
  BEARER_TOKEN = 'bearer-token',
}

export interface ISecurityConfig {
  type: SecurityType;
  apiKey?: string;
  token?: string;
}
