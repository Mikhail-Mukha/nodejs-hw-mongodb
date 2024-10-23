import { ACCESS_TOKEN_LIVE_TIME } from '../constants/time.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resetPassword,
  sendResetPasswordToken,
} from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

const setupSessionCookies = (session, res) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });

  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });
};

export const registerUserController = async (req, res) => {
  const { body } = req;
  const user = await registerUser(body);
  res.json({
    status: 200,
    message: 'Successfully registered a user!',
    data: serializeUser(user),
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;
  const session = await loginUser(body);

  setupSessionCookies(session, res);

  res.json({
    status: 200,
    message: 'Successfully logged a user!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUser(req.cookies.sessionId, req.cookies.sessionToken);
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshSession(
    req.cookies.sessionId,
    req.cookies.sessionToken,
  );

  setupSessionCookies(session, res);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const requestResetPasswordToken = async (req, res) => {
  await sendResetPasswordToken(req.body.email);

  res.json({
    state: 200,
    message: 'Reset password email has been successfully sent.',
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.json({
    state: 200,
    message: 'Password has been successfully reset!',
  });
};
