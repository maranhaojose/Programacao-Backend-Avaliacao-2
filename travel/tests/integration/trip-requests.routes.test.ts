import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../../src/app.js';
import { pool } from '../../src/db/pool.js';
import { ErrorCodes } from '../../src/errors/error-codes.js';
import {
  cleanupTripRequests,
  setupTestDatabase,
  truncateTripRequests,
} from '../support/db.js';
import { stubGlobalFetch } from '../support/brasilapi.stub.js';

const app = createApp();

describe('trip-requests routes', () => {
  let restoreFetch: () => void;

  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterEach(async () => {
    restoreFetch?.();
    await cleanupTripRequests(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('POST /trip-requests', () => {
    it('creates a valid trip request with normalized UTC dates', async () => {
      restoreFetch = stubGlobalFetch();

      const response = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Institutional meeting',
          passengerCount: 3,
        })
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          status: 'pending',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
        }),
      });
    });

    it('returns validation error for invalid passenger count', async () => {
      restoreFetch = stubGlobalFetch();

      const response = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Institutional meeting',
          passengerCount: 0,
        })
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'passengerCount must be greater than zero.',
        },
      });
    });

    it('returns validation error when returnAt is earlier than departureAt', async () => {
      restoreFetch = stubGlobalFetch();

      const response = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T18:00:00.000Z',
          returnAt: '2026-06-24T10:00:00.000Z',
          purpose: 'Institutional meeting',
          passengerCount: 3,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it('blocks creation when departure date is a national holiday', async () => {
      restoreFetch = stubGlobalFetch();

      const response = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-01-01T10:00:00.000Z',
          returnAt: '2026-01-01T18:00:00.000Z',
          purpose: 'Institutional meeting',
          passengerCount: 3,
        })
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: ErrorCodes.HOLIDAY_TRIP_NOT_ALLOWED,
          message: 'Trip requests cannot start on a national holiday.',
        },
      });
    });

    it('returns HOLIDAYS_API_UNAVAILABLE when holiday source fails', async () => {
      restoreFetch = stubGlobalFetch({ fail: true });

      const response = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Maria Silva',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Institutional meeting',
          passengerCount: 3,
        })
        .expect(502);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
          message: 'Holidays API is unavailable.',
        },
      });
    });
  });

  describe('GET /trip-requests', () => {
    it('returns seeded trip requests', async () => {
      const response = await request(app).get('/trip-requests').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(10);
      expect(response.body.data[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          status: expect.stringMatching(/pending|canceled/),
          departureAt: expect.stringMatching(/Z$/),
        }),
      );
    });

    it('returns an empty list when no trip requests exist', async () => {
      await truncateTripRequests(pool);

      const response = await request(app).get('/trip-requests').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });
    });
  });

  describe('GET /trip-requests/:id', () => {
    it('returns an existing trip request', async () => {
      const response = await request(app).get('/trip-requests/seed-001').expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id: 'seed-001',
          requesterName: 'Maria Silva',
        }),
      });
    });

    it('returns TRIP_REQUEST_NOT_FOUND for unknown IDs', async () => {
      const response = await request(app).get('/trip-requests/unknown-id').expect(404);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: ErrorCodes.TRIP_REQUEST_NOT_FOUND,
          message: 'Trip request was not found.',
        },
      });
    });
  });

  describe('PATCH /trip-requests/:id/cancel', () => {
    it('cancels a pending trip request', async () => {
      restoreFetch = stubGlobalFetch();

      const createResponse = await request(app)
        .post('/trip-requests')
        .send({
          requesterName: 'Cancel Test',
          origin: 'Parnaiba',
          destination: 'Teresina',
          departureAt: '2026-06-24T10:00:00.000Z',
          returnAt: '2026-06-24T18:00:00.000Z',
          purpose: 'Cancellation test',
          passengerCount: 1,
        })
        .expect(201);

      const id = createResponse.body.data.id;

      const response = await request(app).patch(`/trip-requests/${id}/cancel`).expect(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.objectContaining({
          id,
          status: 'canceled',
        }),
      });
    });

    it('returns TRIP_REQUEST_NOT_FOUND for unknown IDs', async () => {
      const response = await request(app)
        .patch('/trip-requests/unknown-id/cancel')
        .expect(404);

      expect(response.body.error.code).toBe(ErrorCodes.TRIP_REQUEST_NOT_FOUND);
    });

    it('returns TRIP_REQUEST_ALREADY_CANCELED for repeated cancellation', async () => {
      const response = await request(app).patch('/trip-requests/seed-008/cancel').expect(409);

      expect(response.body).toEqual({
        success: false,
        error: {
          code: ErrorCodes.TRIP_REQUEST_ALREADY_CANCELED,
          message: 'Trip request is already canceled.',
        },
      });
    });
  });
});
