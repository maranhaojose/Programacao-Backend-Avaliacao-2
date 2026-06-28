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
