import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const botstrap = async () => {
  await initMongoConnection();
  setupServer();
};

botstrap();
