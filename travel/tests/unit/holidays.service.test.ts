import { afterEach, describe, expect, it } from 'vitest';
import { AppError } from '../../src/errors/app-error.js';
import { ErrorCodes } from '../../src/errors/error-codes.js';
import {
  isDepartureDateHoliday,
  listHolidaysByYear,
} from '../../src/holidays/holidays.service.js';
import { createBrasilApiFetchStub, DEFAULT_HOLIDAYS } from '../support/brasilapi.stub.js';

describe('holidays service', () => {
  afterEach(() => {
    globalThis.fetch = fetch;
  });

  it('lists holidays for a valid year using normalized response data', async () => {
    const fetchStub = createBrasilApiFetchStub({ holidays: DEFAULT_HOLIDAYS });
    const holidays = await listHolidaysByYear(2026, fetchStub);

    expect(holidays).toEqual([
      {
        date: '2026-01-01',
        name: 'Universal Fraternization Day',
        type: 'national',
      },
      {
        date: '2026-04-21',
        name: 'Tiradentes Day',
        type: 'national',
      },
      {
        date: '2026-09-07',
        name: 'Independence Day',
        type: 'national',
      },
      {
        date: '2026-12-25',
        name: 'Christmas Day',
        type: 'national',
      },
    ]);
  });

  it('detects when a departure date matches a national holiday', async () => {
    const fetchStub = createBrasilApiFetchStub({ holidays: DEFAULT_HOLIDAYS });
    const isHoliday = await isDepartureDateHoliday('2026-01-01', fetchStub);
    expect(isHoliday).toBe(true);
  });

  it('returns false when departure date is not a holiday', async () => {
    const fetchStub = createBrasilApiFetchStub({ holidays: DEFAULT_HOLIDAYS });
    const isHoliday = await isDepartureDateHoliday('2026-06-24', fetchStub);
    expect(isHoliday).toBe(false);
  });

  it('maps upstream failures to HOLIDAYS_API_UNAVAILABLE', async () => {
    const fetchStub = createBrasilApiFetchStub({ fail: true });

    await expect(listHolidaysByYear(2026, fetchStub)).rejects.toMatchObject({
      code: ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
    });

    await expect(isDepartureDateHoliday('2026-06-24', fetchStub)).rejects.toMatchObject({
      code: ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
    });
  });

  it('rejects invalid year values', async () => {
    await expect(listHolidaysByYear(1800)).rejects.toBeInstanceOf(AppError);
    await expect(listHolidaysByYear(Number.NaN)).rejects.toMatchObject({
      code: ErrorCodes.VALIDATION_ERROR,
    });
  });
});
