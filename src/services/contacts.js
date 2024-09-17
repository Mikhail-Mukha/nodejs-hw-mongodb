import { contactsModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contats = contactsModel.find();
  return contats;
};

export const getContactsByld = async (contactId) => {
  const contat = contactsModel.findById(contactId);
  return contat;
};
