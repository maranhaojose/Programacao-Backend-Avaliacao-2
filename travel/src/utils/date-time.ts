<<<<<<< HEAD
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

const ISO_DATE_TIME_WITH_TIMEZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;

export function parseDateTime(value: unknown, fieldName = "date-time"): Date {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new AppError(ERROR_CODES.VALIDATION_ERROR, `${fieldName} must be a valid date-time.`);
    }

    return value;
  }

  if (typeof value !== "string" || !ISO_DATE_TIME_WITH_TIMEZONE.test(value)) {
    throw new AppError(
      ERROR_CODES.VALIDATION_ERROR,
      `${fieldName} must be an ISO 8601 date-time with an explicit timezone.`,
=======
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';

export function parseAndNormalizeDateTime(value: unknown, fieldName: string): Date {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      `${fieldName} must be a valid date-time value.`,
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
    );
  }

  const parsed = new Date(value);
<<<<<<< HEAD

  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, `${fieldName} must be a valid date-time.`);
=======
  if (Number.isNaN(parsed.getTime())) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      `${fieldName} must be a valid date-time value.`,
    );
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  }

  return parsed;
}

<<<<<<< HEAD
export function toUtcIsoString(value: Date): string {
  return value.toISOString();
}

export function normalizeToUtcIso(value: unknown, fieldName?: string): string {
  return toUtcIsoString(parseDateTime(value, fieldName));
}

export function getUtcDatePart(value: Date | string): string {
  const date = typeof value === "string" ? parseDateTime(value) : value;
=======
export function toUtcIsoString(date: Date): string {
  return date.toISOString();
}

export function toUtcDateOnly(date: Date): string {
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  return date.toISOString().slice(0, 10);
}
