// src/core/config/validation.ts
import * as Joi from 'joi';

export function validate(config: Record<string, any>) {
  const schema = Joi.object({
    APP_PORT: Joi.number().default(3000),
    LIST_CORS: Joi.string().required(),
    SECRETKEY_AUTH: Joi.string().required(),
    TOKEN_EXPIRATION: Joi.string().default('1h'),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GCP_PROJECT_ID: Joi.string().required(),
    GCP_FIRESTORE_DATABASE_ID: Joi.string().allow('').optional(),
    EXTERNAL_API_BASE_URL: Joi.string().required(),
    EXTERNAL_API_SECURITY_TYPE: Joi.string().required().default('none'),
    EXTERNAL_API_KEY: Joi.string().allow('').optional(),
    EXTERNAL_API_TOKEN: Joi.string().allow('').optional(),
    CLOUD_RUN_API_BASE_URL: Joi.string().allow('').optional(),
    CLOUD_RUN_TARGET_URL: Joi.string().allow('').optional(),
    CLOUD_RUN_ID_TOKEN: Joi.string().allow('').optional(),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(3306),
    DB_USER: Joi.string().default('root'),
    DB_PASS: Joi.string().default('root'),
    DB_DB: Joi.string().default('appdb'),
  });

  const { error, value } = schema.validate(config, { allowUnknown: true });
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return value;
}
