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

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get('/:contactId', ctrlWrapper(getContactsByIdController));

contactsRouter.post('/', ctrlWrapper(createContactController));

contactsRouter.patch('/:contactId', ctrlWrapper(patchContactController));

contactsRouter.put('/:contactId', ctrlWrapper(putContactController));

contactsRouter.delete('/:contactId', ctrlWrapper(deleteContactByIdController));

export default contactsRouter;
