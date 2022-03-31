import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import HttpError from '../../utils/http-error';

const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: err.message,
      code: StatusCodes[err.status],
    });
  }

  console.log(err);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error!',
    code: StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR],
  });
};

export default errorMiddleware;
