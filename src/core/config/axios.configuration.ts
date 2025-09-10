export enum SecurityType {
  NONE = 'none',
  API_KEY = 'api-key',
  BEARER_TOKEN = 'bearer-token',
  GOOGLE_CLOUD_RUN_AUTH = 'google-cloud-run-auth',
}

export interface ISecurityConfig {
  type: SecurityType;
  apiKey?: string;
  token?: string;
  cloudRunTargetUrl?: string;
  cloudRunIdToken?: string;
}
