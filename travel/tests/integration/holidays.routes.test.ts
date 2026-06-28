import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { ErrorCodes } from '../../src/errors/error-codes.js';
import { DEFAULT_HOLIDAYS, stubGlobalFetch } from '../support/brasilapi.stub.js';

const app = createApp();

describe('holidays routes', () => {
  let restoreFetch: () => void;

  afterEach(() => {
    restoreFetch?.();
  });

  it('returns holidays for a valid year', async () => {
    restoreFetch = stubGlobalFetch({ holidays: DEFAULT_HOLIDAYS });

    const response = await request(app).get('/holidays/2026').expect(200);

    expect(response.body).toEqual({
      success: true,
      data: DEFAULT_HOLIDAYS,
    });
  });

  it('returns validation error for invalid year', async () => {
    const response = await request(app).get('/holidays/1800').expect(400);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: 'Year must be a valid integer between 1900 and 9999.',
      },
    });
  });

  it('returns HOLIDAYS_API_UNAVAILABLE when upstream fails', async () => {
    restoreFetch = stubGlobalFetch({ fail: true });

    const response = await request(app).get('/holidays/2026').expect(502);

    expect(response.body).toEqual({
      success: false,
      error: {
        code: ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
        message: 'Holidays API is unavailable.',
      },
    });
  });
});
