import { ErrorRequestHandler } from 'express';

const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err.status) {
    return res.status(err.status).json({ message: err.message })
  }
};

export default errorMiddleware;
