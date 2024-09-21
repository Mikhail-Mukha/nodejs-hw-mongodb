export const errorHandlerMiddleware = (err, req, res, next) => {
  res.status(500).json({
    status: 500,
    message: 'Something wrong on our side',
    error: err.message,
  });
};
