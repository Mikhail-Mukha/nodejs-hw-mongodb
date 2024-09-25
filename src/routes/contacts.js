import { Router } from 'express';
import {
  createContactController,
  deleteContactByIdController,
  getContactsByIdController,
  getContactsController,
  patchContactController,
  putContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateMongoIdParam } from '../middlewares/validateMongoIdParam.js';
import { validateBody } from '../middlewares/validateBody.js';

const contactsRouter = Router();

contactsRouter.use('/:contactId', validateMongoIdParam('contactId'));

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', validateBody, ctrlWrapper(createContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactController));

contactsRouter.put('/:contactId', ctrlWrapper(putContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
