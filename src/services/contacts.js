import { contactsModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  // throw new Error('test');
  return await contactsModel.find();
};

export const getContactsById = async (contactId) => {
  return await contactsModel.findById(contactId);
};
