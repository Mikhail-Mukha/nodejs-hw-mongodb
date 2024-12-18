import { MONGO_DB_VARS } from '../constants/index.js';
import { env } from './env.js';
import { saveImageLocally } from './saveImageLocally.js';
import { saveImageToCloudinary } from './saveImageToCloudinary.js';

export const saveImage = async (file) => {
  if (env(MONGO_DB_VARS.IS_CLOUDINARY_ENABLED) === 'true') {
    return await saveImageToCloudinary(file);
  } else {
    return await saveImageLocally(file);
  }
};
