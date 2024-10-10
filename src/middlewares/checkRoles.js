import createHttpError from 'http-errors';
import { contactsModel } from '../db/models/contact.js';

export const checkRoles = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await contactsModel.findById({
      _id: contactId,
    });

    if (!contact || contact.userId.toString() !== req.user._id.toString()) {
      return next(
        createHttpError(403, 'User does not have access to such contact!'),
      );
    }
    next();
  } catch (error) {
    console.error(error);
    return next(
      createHttpError(500, 'An error occurred while checking roles!'),
    );
  }
};
