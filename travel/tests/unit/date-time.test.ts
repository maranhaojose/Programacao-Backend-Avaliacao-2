import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/errors/app-error.js';
import { ErrorCodes } from '../../src/errors/error-codes.js';
import {
  parseAndNormalizeDateTime,
  toUtcDateOnly,
  toUtcIsoString,
} from '../../src/utils/date-time.js';

describe('date-time utilities', () => {
  it('normalizes valid ISO date-time strings to UTC with Z suffix', () => {
    const parsed = parseAndNormalizeDateTime('2026-06-24T10:00:00.000Z', 'departureAt');
    expect(toUtcIsoString(parsed)).toBe('2026-06-24T10:00:00.000Z');
  });

  it('normalizes offset date-time strings to UTC', () => {
    const parsed = parseAndNormalizeDateTime('2026-06-24T07:00:00-03:00', 'departureAt');
    expect(toUtcIsoString(parsed)).toBe('2026-06-24T10:00:00.000Z');
  });

  it('extracts UTC date-only value for holiday matching', () => {
    const parsed = parseAndNormalizeDateTime('2026-01-01T15:30:00.000Z', 'departureAt');
    expect(toUtcDateOnly(parsed)).toBe('2026-01-01');
  });

  it('rejects missing date-time values', () => {
    expect(() => parseAndNormalizeDateTime(undefined, 'departureAt')).toThrow(AppError);
    try {
      parseAndNormalizeDateTime(undefined, 'departureAt');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe(ErrorCodes.VALIDATION_ERROR);
    }
  });

  it('rejects malformed date-time values', () => {
    expect(() => parseAndNormalizeDateTime('not-a-date', 'returnAt')).toThrow(AppError);
    try {
      parseAndNormalizeDateTime('not-a-date', 'returnAt');
    } catch (error) {
      expect(error).toBeInstanceOf(AppError);
      expect((error as AppError).code).toBe(ErrorCodes.VALIDATION_ERROR);
    }
  });
});
