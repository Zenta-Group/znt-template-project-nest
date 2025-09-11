export const configuration = () => ({
  port: parseInt(process.env.PORT ?? process.env.APP_PORT, 10) ?? 3000,
  listCors: process.env.LIST_CORS,
  secretKeyAuth: process.env.SECRETKEY_AUTH,
  tokenExpiration: process.env.TOKEN_EXPIRATION ?? '1h',
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  // Firebase / GCP
  gcpProjectId: process.env.GCP_PROJECT_ID,
  gcpKeyFile:
    process.env.GCP_KEY_FILE ?? process.env.GOOGLE_APPLICATION_CREDENTIALS,
  gcpFirestoreDatabaseId: process.env.GCP_FIRESTORE_DATABASE_ID,
  //Axios
  externalApiBaseUrl: process.env.EXTERNAL_API_BASE_URL,
  externalApiSecurityType: process.env.EXTERNAL_API_SECURITY_TYPE,
  externalApiKey: process.env.EXTERNAL_API_KEY,
  externalApiToken: process.env.EXTERNAL_API_TOKEN,
  cloudRunApiBaseUrl: process.env.CLOUD_RUN_API_BASE_URL,
  cloudRunTargetUrl: process.env.CLOUD_RUN_TARGET_URL,
  cloudRunIdToken: process.env.CLOUD_RUN_ID_TOKEN,

  // Database
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASS ?? 'root',
    name: process.env.DB_DB ?? 'appdb',
  },
});
