import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY_SECONDS: Joi.number().default(3600),
  MONGODB_URL: Joi.string().required(),
});
