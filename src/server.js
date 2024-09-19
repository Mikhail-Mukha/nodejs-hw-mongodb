import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getAllContacts, getContactsById } from './services/contacts.js';

export const setupServer = () => {
  dotenv.config();

  const app = express();

  const PORT = process.env.PORT || 3000;

  //   app.use('*', (req, res, next) => {
  //     console.log(`Time ${new Date().toLocaleString()}`);
  //     next();
  //   });

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world',
    });
  });

  app.get('/contacts', async (req, res) => {
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
  });

  app.get('/contacts/:contactId', async (req, res) => {
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
        status: 404,
        message: 'Something went wrong',
        error: error.message,
      });
    }
  });

  app.use('*', (req, res, next) => {
    res.status(404).json({
      status: 404,
      message: 'Route not found',
    });
    next();
  });

  app.use('*', (err, req, res, next) => {
    res.status(500).json({
      status: 500,
      message: 'Something wrong on our side',
      error: err.message,
    });
  });

  app.listen(PORT, (err) => {
    if (err) {
      console.error(`Error starting the server: ${err.message}`);
    } else {
      console.log(`Server is running on port ${PORT}`);
    }
  });
};
