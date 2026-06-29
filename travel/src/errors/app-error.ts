import { HTTP_STATUS_BY_ERROR_CODE, type ErrorCode } from './error-codes.js';

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  public constructor(code: ErrorCode, message: string, statusCode = HTTP_STATUS_BY_ERROR_CODE[code]) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}
