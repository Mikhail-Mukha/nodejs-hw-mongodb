import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  regiterUserController,
} from '../controllers/auth.js';
import { registerUserValidationSchema } from '../validation/registerUserValidationSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';

const authRputer = Router();

authRputer.post(
  '/register',
  validateBody(registerUserValidationSchema),
  ctrlWrapper(regiterUserController),
);

authRputer.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);

authRputer.post('/logout');

authRputer.post('/refresh-session');

export default authRputer;
