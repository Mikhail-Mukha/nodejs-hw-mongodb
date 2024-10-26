import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { saveImageToCloudinary } from '../utils/saveImageToCloudinary.js';
import { createContactSchemaValidation } from '../validation/createContactValidationSchema.js';

export const getContactsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const { page, perPage } = parsePaginationParams(req.query);

    const { sortOrder, sortBy } = parseSortParams(req.query);

    const filter = parseFilterParams(req.query);

    const contacts = await getAllContacts({
      userId,
      page,
      perPage,
      sortOrder,
      sortBy,
      filter,
    });

    res.status(200).json({
      status: 200,
      message: 'Successfully fetched all contacts',
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Unable to fetch contacts',
      error: error.message,
    });
  }
};

export const getContactsByIdController = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const userId = req.user._id;

    const contact = await getContactsById(contactId, userId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

export const deleteContactByIdController = async (req, res) => {
  const { contactId } = req.params;

  await deleteContactById(contactId);

  res.status(204).send();
};

export const createContactController = async (req, res) => {
  try {
    const { error, value } = createContactSchemaValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        message: 'Validation error',
        error: error.details[0].message,
      });
    }

    const photo = req.file ? await saveImageToCloudinary(req.file) : null;
    const contactData = {
      ...value,
      photo,
    };

    const contact = await createContact(contactData, req.user.id);

    res.status(201).send({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: 'Unable to create contact',
      error: error.message,
    });
  }
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body, file } = req;
  const { contact } = await updateContact(contactId, { ...body, file });

  res.send({
    status: 200,
    message: `Successfully updated a contact!`,
    data: contact,
  });
};

export const putContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const { contact, isNew } = await updateContact(contactId, body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  res.status(status).send({
    status: 200,
    message: `Successfully upserted a contact!`,
    data: contact,
  });
};
