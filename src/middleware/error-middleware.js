import { ResponseError } from '../error/response-error.js';

const errorMiddleware = async (err, req, res, next) => {
  if (!err) return next();

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      errorMessage: err.message,
      data: err.data,
    });
  } else {
    res.status(500).json({
      errorMessage: err.message,
    });
  }

  next();
};

export { errorMiddleware };
