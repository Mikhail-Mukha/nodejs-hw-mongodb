import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isFavourite: {
      type: Boolean,
      required: true,
      default: false,
    },
    contactType: {
      type: String,
      required: true,
      enum: ['home', 'personal', 'work'],
      default: 'personal',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsModel = model('contacts', contactSchema);
