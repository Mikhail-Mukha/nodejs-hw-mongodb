import { contactsModel } from '../db/models/contact.js';
import createHttpError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  perPage,
  page,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = contactsModel.find();

  if (filter.contactType) {
    contactsQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const [contactsCount, contacts] = await Promise.all([
    contactsModel.find().merge(contactsQuery).countDocuments(),
    contactsQuery
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactsById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);

  if (!contact) {
    throw createHttpError(404, {
      status: '404',
      message: `Contact with id ${contactId} not found!`,
    });
  }

  return contact;
};

export const createContact = async (payload, userId) => {
  return await contactsModel.create({ ...payload, userId });
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
  await contactsModel.findByIdAndDelete(contactId);
};
