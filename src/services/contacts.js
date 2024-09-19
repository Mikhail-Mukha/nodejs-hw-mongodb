import { contactsModel } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await contactsModel.find();
    return contacts;
  } catch (Error) {
    throw new Error('Unable to fetch contacts');
  }
};

export const getContactsById = async (contactId) => {
  try {
    const contact = await contactsModel.findById(contactId);
    return contact;
  } catch (Error) {
    throw new Error('Error fetching contact by ID');
  }
};
