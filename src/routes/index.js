import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRputer from './auth.js';

const router = Router();

router.use('/contacts', contactsRouter);

router.use('/auth', authRputer);

export default router;
