import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';

export interface ErrorResponseBody {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    const body: ErrorResponseBody = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    };
    return res.status(err.statusCode).json(body);
  }

  console.error('Unhandled error:', err);

  const body: ErrorResponseBody = {
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred.',
    },
  };
  return res.status(500).json(body);
}
