import { ACCESS_TOKEN_LIVE_TIME } from '../constants/time.js';
import { loginUser, registerUser } from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';

export const regiterUserController = async (req, res) => {
  const { body } = req;
  const user = await registerUser(body);
  res.json({
    status: 200,
    message: 'Successfuly registered a user!',
    data: serializeUser(user),
  });
};

export const loginUserController = async (req, res) => {
  const { body } = req;
  const session = await loginUser(body);

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });

  res.cookie('accsesToken', session.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });

  res.json({
    status: 200,
    message: 'Successfuly logged a user!',
    data: { accessToken: session.accessToken },
  });
};
