import { HttpError } from 'http-errors';

export const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof HttpError) {
    return res.status(err.status || 500).json({
      status: 500,
      message: err.name,
      error: err.message || 'Error',
    });
  }
  res.status(500).json({
    status: 500,
    message: 'Something wrong on our side',
    error: err.message,
  });
};
