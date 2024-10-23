import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
// import env from '../../env.js';
// import MONGO_DB_VARS from '../constants/index.js';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';
import { emailClient } from '../utils/emailClient.js';
import { env } from '../utils/env.js';
import { MONGO_DB_VARS } from '../constants/index.js';
import { generateResetPasswordEmail } from '../utils/generateResetPasswordEmail.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(16).toString('base64'),
  refreshToken: crypto.randomBytes(16).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
});
const findUserByEmail = async (email) => await User.findOne({ email });

export const registerUser = async (payload) => {
  let user = await findUserByEmail(payload.email);
  if (user) {
    throw createHttpError(409, 'User with this email already registered!');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  user = await User.create({ ...payload, password: hashedPassword });

  return user;
};

export const loginUser = async (payload) => {
  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const arePasswordsEqual = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!arePasswordsEqual) {
    throw createHttpError(401, 'User email or password is incorrect!');
  }

  await Session.deleteOne({ userId: user._id });

  const session = await Session.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const logoutUser = async (sessionId, sessionToken) => {
  await Session.deleteOne({ _id: sessionId, refreshToken: sessionToken });
};

export const refreshSession = async (sessionId, sessionToken) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const now = new Date();

  if (session.refreshTokenValidUntil < now) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: sessionId, refreshToken: sessionToken });

  const newSession = await Session.create({
    userId: session.userId,
    ...createSession(),
  });

  return newSession;
};

export const sendResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(MONGO_DB_VARS.JWT_SECRET),
    { expiresIn: 60 * 15 },
  );

  const resetLink = `${env(
    MONGO_DB_VARS.FRONTEND_DOMAIN,
  )}/reset-password?token=${resetToken}`;
  try {
    await emailClient.sendMail({
      to: email,
      from: env(MONGO_DB_VARS.SMTP_FROM),
      html: generateResetPasswordEmail({
        email: user.name,
        resetLink: resetLink,
      }),
      subject: 'Reset you password!',
    });
  } catch (err) {
    console.log(err);
    throw createHttpError(500, 'Error is sending email!');
  }
};

export const resetPassword = async (token, password) => {
  let payload;
  try {
    payload = jwt.verify(token, env(MONGO_DB_VARS.JWT_SECRET));
  } catch (err) {
    throw createHttpError(401, err.message);
  }
  const user = await User.findById(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(user._id, { password: hashedPassword });
};
