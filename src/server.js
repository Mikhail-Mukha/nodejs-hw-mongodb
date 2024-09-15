import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';

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

  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Route not found',
    });
    next();
  });

  app.use('*', (err, req, res, next) => {
    res.status(500).json({
      message: 'Something wrong on our side',
      error: err.message,
    });
  });

  app
    .listen(PORT, (err) => {
      if (err) {
        console.error(`Enrror starting the server: ${err.message}`);
      } else {
        console.log(`Server is running on port ${PORT}`);
      }
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
      } else {
        console.error(`Error occurred: ${err.message}`);
      }
    });
};
