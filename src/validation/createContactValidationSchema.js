import Joi from 'joi';

export const createContactSchemaValidation = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email(),
  isFavourite: Joi.boolean().truthy('true').falsy('false'),
  contactType: Joi.string().required().valid('home', 'personal', 'work'),
});
