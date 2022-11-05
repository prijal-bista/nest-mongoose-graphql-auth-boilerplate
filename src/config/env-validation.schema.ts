import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  // App related env
  PORT: Joi.number().default(3000),
  APP_NAME: Joi.string().required(),
  APP_URL: Joi.string().required(),
  FRONTEND_URL: Joi.string(),

  // Jwt
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY_SECONDS: Joi.number().default(3600),

  // Mongo db
  MONGODB_URL: Joi.string().required(),

  // Mail related env
  MAIL_HOST: Joi.string(),
  MAIL_PORT: Joi.number().default(2525),
  MAIL_SECURE: Joi.boolean().default(true),
  MAIL_USERNAME: Joi.string(),
  MAIL_PASSWORD: Joi.string(),
  MAIL_FROM: Joi.string(),

  // Queue name to use in redis for emails
  // MAIL_QUEUE_NAME: Joi.string().default('mail'), // could not use in mailService in @InjectQueue

  // Queue related env
  // When queue connection is sync, queue will not be used.
  QUEUE_CONNECTION: Joi.string().required().valid('sync', 'redis'),
  QUEUE_REDIS_HOST: Joi.string().required(),
  QUEUE_REDIS_PORT: Joi.number().required(),
});
