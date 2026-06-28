<<<<<<< HEAD
import type { ErrorRequestHandler } from "express";
import { isAppError } from "../errors/app-error.js";
import { ERROR_CODES, ERROR_MESSAGES } from "../errors/error-codes.js";

export type ErrorResponse = {
=======
import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';

export interface ErrorResponseBody {
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  success: false;
  error: {
    code: string;
    message: string;
  };
<<<<<<< HEAD
};

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (isAppError(error)) {
    return response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
    } satisfies ErrorResponse);
  }

  return response.status(500).json({
    success: false,
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    },
  } satisfies ErrorResponse);
};
=======
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
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
