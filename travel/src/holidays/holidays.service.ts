import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';
import { fetchHolidaysByYear } from './holidays.client.js';
import type { Holiday } from './holidays.types.js';

function normalizeHoliday(holiday: { date: string; name: string; type: string }): Holiday {
  return {
    date: holiday.date,
    name: holiday.name,
    type: holiday.type,
  };
}

function mapUpstreamFailure(): never {
  throw new AppError(
    ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
    'Holidays API is unavailable.',
  );
}

export async function listHolidaysByYear(
  year: number,
  fetchFn: typeof fetch = fetch,
): Promise<Holiday[]> {
  if (!Number.isInteger(year) || year < 1900 || year > 9999) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'Year must be a valid integer between 1900 and 9999.',
    );
  }

  try {
    const holidays = await fetchHolidaysByYear(year, fetchFn);
    return holidays.map(normalizeHoliday);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    mapUpstreamFailure();
  }
}

export async function isDepartureDateHoliday(
  departureDate: string,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  const year = Number.parseInt(departureDate.slice(0, 4), 10);

  try {
    const holidays = await fetchHolidaysByYear(year, fetchFn);
    return holidays.some((holiday) => holiday.date === departureDate);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    mapUpstreamFailure();
  }
}
