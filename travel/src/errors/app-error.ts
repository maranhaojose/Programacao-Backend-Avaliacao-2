<<<<<<< HEAD
import { ERROR_HTTP_STATUS, ERROR_MESSAGES, type ErrorCode } from "./error-codes.js";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  public constructor(code: ErrorCode, message = ERROR_MESSAGES[code], statusCode = ERROR_HTTP_STATUS[code]) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
=======
import { ErrorCode, HTTP_STATUS_BY_ERROR_CODE } from './error-codes.js';

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(code: ErrorCode, message: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = HTTP_STATUS_BY_ERROR_CODE[code];
  }
}
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
