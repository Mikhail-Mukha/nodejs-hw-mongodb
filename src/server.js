import express from 'express';
// import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandlerMiddleware } from './middlewares/errorHandler.js';
import { notFoundMiddleware } from './middlewares/notFound.js';
import router from './routes/index.js';

export const setupServer = () => {
  dotenv.config();

  const app = express();

  const PORT = process.env.PORT || 3000;

  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );

  app.use(cors());

  app.use(
    express.json({
      type: ['application/json', 'application/vnd.api+json'],
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world',
    });
  });

  app.use(router);

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, (err) => {
    if (err) {
      console.error(`Error starting the server: ${err.message}`);
    } else {
      console.log(`Server is running on port ${PORT}`);
    }
  });
};
