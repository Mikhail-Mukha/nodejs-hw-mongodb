import { contactsModel } from '../db/models/contact.js';
import createHttpError from 'http-errors';

export const getAllContacts = async () => {
  // throw new Error('test');
  return await contactsModel.find();
};

export const getContactsById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);

  if (!contact) {
    throw createHttpError(404, {
      status: '404',
      message: `Contact with id ${contactId} not found!`,
    });
  }
};

export const createContact = async (payload) => {
  return await contactsModel.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsModel.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult.value) {
    throw createHttpError(404, {
      status: '404',
      message: `Contact with id ${contactId} not found!`,
    });
  }

  return {
    contact: rawResult.value,
    isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};

export const deleteContactById = async (contactId) => {
  await contactsModel.findOneAndDelete(contactId);
};
