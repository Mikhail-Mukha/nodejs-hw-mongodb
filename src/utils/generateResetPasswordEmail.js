import fs from 'node:fs';
import path from 'node:path';
import { TEMPLATES_PATH } from '../constants/path.js';
import Handlebars from 'handlebars';

const template = fs
  .readFileSync(path.join(TEMPLATES_PATH, 'reset-password-email.html'))
  .toString();

export const generateResetPasswordEmail = ({ name, resetLink }) => {
  const handlebarsTemplate = Handlebars.compile(template);
  return handlebarsTemplate({ name, resetLink });
};
