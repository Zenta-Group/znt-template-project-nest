export const configuration = () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  listCors: process.env.LIST_CORS,
  secretKeyAuth: process.env.SECRETKEY_AUTH,
  tokenExpiration: process.env.TOKEN_EXPIRATION || '1h',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  // Firebase / GCP
  gcpProjectId: process.env.GCP_PROJECT_ID,
  gcpFirestoreDatabaseId: process.env.GCP_FIRESTORE_DATABASE_ID,
  //Axios
  externalApiBaseUrl: process.env.EXTERNAL_API_BASE_URL,
  externalApiSecurityType: process.env.EXTERNAL_API__SECURITY_TYPE,
  externalApiKey: process.env.EXTERNAL_API_KEY,
  externalApiToken: process.env.EXTERNAL_API_TOKEN,
});
