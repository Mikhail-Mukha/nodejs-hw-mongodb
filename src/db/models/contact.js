import { model, Schema } from 'mongoose';
import { User } from './user.js';

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
    userId: {
      type: Schema.ObjectId,
      required: true,
      ref: User,
    },
    photo: {
      type: String,
      default: null,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const contactsModel = model('contacts', contactSchema);
