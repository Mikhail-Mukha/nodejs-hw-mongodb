import {
  createContact,
  deleteContactById,
  getAllContacts,
  getContactsById,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getAllContacts();

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

export const getContactsByIdController = async (req, res) => {
  try {
    const { contactId } = req.params;

    const contact = await getContactsById(contactId);

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
  const contact = await createContact(req.body);

  res.status(201).send({
    status: 201,
    message: `Successfully create contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const { body } = req;
  const { contact } = await updateContact(contactId, body);

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
