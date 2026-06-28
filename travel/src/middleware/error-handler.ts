import type { ErrorRequestHandler } from "express";
import { isAppError } from "../errors/app-error.js";
import { ERROR_CODES, ERROR_MESSAGES } from "../errors/error-codes.js";

export type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
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
