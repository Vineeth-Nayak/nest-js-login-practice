import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .required()
    .default('development'),
  PORT: Joi.number().required(),
  MONGO_URI: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(10).required(),
  JWT_EXPIRES_IN: Joi.string().default('1h'),
  POSTGRES_DATABASE_URL: Joi.string().uri().required(),
});
