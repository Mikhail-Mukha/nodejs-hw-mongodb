import Joi from 'joi';

const createContactSchemaValidation = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().required().email(),
  isFavourite: Joi.boolean().required().default(false),
  contactType: Joi.string().required().valid('home', 'personal', 'work'),
});

export const validateBody = async (req, res, next) => {
  const { body } = req;

  try {
    await createContactSchemaValidation.validateAsync(body, {
      convert: false,
      abortEarly: false,
    });

    next();
  } catch (err) {
    next(err);
  }
};
