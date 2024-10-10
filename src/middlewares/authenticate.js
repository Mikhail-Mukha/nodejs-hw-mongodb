import createHttpError from 'http-errors';

import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Auth header is required!'));
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header must be of type Bearer!'));
  }

  const session = await Session.findOne({ accessToken: token });

  if (!session) {
    return next(
      createHttpError(401, 'Auth token is not associated with any session!'),
    );
  }

  const isAccessTokenExpired =
    new Date() > new Date(session.accessTokenValidUntil);

  if (isAccessTokenExpired) {
    next(createHttpError(401, 'Access token expired'));
    return;
  }

  const user = await User.findById(session.userId);

  if (!user) {
    next(createHttpError(401, 'No user is associated with this session'));
    return;
  }

  req.user = user;

  next();
};
