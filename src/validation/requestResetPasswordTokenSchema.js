import Joi from 'joi';

export const requestResetPasswordTokenSchema = Joi.object({
  email: Joi.string().required().email(),
});
