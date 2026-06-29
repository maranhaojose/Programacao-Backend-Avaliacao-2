import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';

const ISO_DATE_TIME_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export function parseAndNormalizeDateTime(value: unknown, fieldName: string): Date {
  if (typeof value !== 'string' || !ISO_DATE_TIME_WITH_TIMEZONE.test(value)) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      `${fieldName} must be an ISO 8601 date-time with an explicit timezone.`,
    );
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, `${fieldName} must be a valid date-time.`);
  }

  return parsed;
}

export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

export function toUtcDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}
