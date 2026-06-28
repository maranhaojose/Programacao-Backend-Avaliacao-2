import { afterEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../../src/errors/app-error.js';
import { ErrorCodes } from '../../src/errors/error-codes.js';
import * as holidaysService from '../../src/holidays/holidays.service.js';
import * as repository from '../../src/trip-requests/trip-requests.repository.js';
import {
  cancelTripRequestService,
  createTripRequestService,
  parsePassengerCount,
  validateCreateInput,
} from '../../src/trip-requests/trip-requests.service.js';
import type { TripRequest } from '../../src/trip-requests/trip-requests.types.js';
import { createBrasilApiFetchStub } from '../support/brasilapi.stub.js';

const validInput = {
  requesterName: 'Maria Silva',
  origin: 'Parnaiba',
  destination: 'Teresina',
  departureAt: '2026-06-24T10:00:00.000Z',
  returnAt: '2026-06-24T18:00:00.000Z',
  purpose: 'Institutional meeting',
  passengerCount: 3,
};

const mockTripRequest: TripRequest = {
  id: 'trip-001',
  ...validInput,
  status: 'pending',
  createdAt: '2026-06-20T14:30:00.000Z',
};

describe('trip-requests service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    globalThis.fetch = fetch;
  });

  describe('validateCreateInput', () => {
    it('accepts valid input and normalizes dates', () => {
      const input = validateCreateInput(validInput);
      expect(input.departureAt).toBe('2026-06-24T10:00:00.000Z');
      expect(input.returnAt).toBe('2026-06-24T18:00:00.000Z');
    });

    it('rejects missing required fields', () => {
      expect(() => validateCreateInput({ ...validInput, requesterName: '' })).toThrow(AppError);
    });

    it('rejects invalid passenger count values', () => {
      for (const value of [0, -1, 1.5]) {
        expect(() => parsePassengerCount(value)).toThrow(AppError);
        try {
          parsePassengerCount(value);
        } catch (error) {
          expect((error as AppError).code).toBe(ErrorCodes.VALIDATION_ERROR);
        }
      }
    });

    it('rejects returnAt earlier than departureAt', () => {
      expect(() =>
        validateCreateInput({
          ...validInput,
          departureAt: '2026-06-24T18:00:00.000Z',
          returnAt: '2026-06-24T10:00:00.000Z',
        }),
      ).toThrow(AppError);

      try {
        validateCreateInput({
          ...validInput,
          departureAt: '2026-06-24T18:00:00.000Z',
          returnAt: '2026-06-24T10:00:00.000Z',
        });
      } catch (error) {
        expect((error as AppError).code).toBe(ErrorCodes.VALIDATION_ERROR);
      }
    });
  });

  describe('createTripRequestService', () => {
    it('creates a pending trip request when departure is not a holiday', async () => {
      const fetchStub = createBrasilApiFetchStub();
      vi.spyOn(holidaysService, 'isDepartureDateHoliday').mockResolvedValue(false);
      vi.spyOn(repository, 'createTripRequest').mockResolvedValue(mockTripRequest);

      const result = await createTripRequestService(validInput, fetchStub);
      expect(result.status).toBe('pending');
      expect(result.id).toBe('trip-001');
    });

    it('blocks creation when departure date is a national holiday', async () => {
      const fetchStub = createBrasilApiFetchStub();
      vi.spyOn(holidaysService, 'isDepartureDateHoliday').mockResolvedValue(true);

      await expect(createTripRequestService(validInput, fetchStub)).rejects.toMatchObject({
        code: ErrorCodes.HOLIDAY_TRIP_NOT_ALLOWED,
      });
    });

    it('blocks creation when holiday validation is unavailable', async () => {
      const fetchStub = createBrasilApiFetchStub({ fail: true });
      vi.spyOn(holidaysService, 'isDepartureDateHoliday').mockRejectedValue(
        new AppError(ErrorCodes.HOLIDAYS_API_UNAVAILABLE, 'Holidays API is unavailable.'),
      );

      await expect(createTripRequestService(validInput, fetchStub)).rejects.toMatchObject({
        code: ErrorCodes.HOLIDAYS_API_UNAVAILABLE,
      });
    });
  });

  describe('cancelTripRequestService', () => {
    it('cancels a pending trip request', async () => {
      vi.spyOn(repository, 'getTripRequestStatus').mockResolvedValue('pending');
      vi.spyOn(repository, 'cancelTripRequest').mockResolvedValue({
        ...mockTripRequest,
        status: 'canceled',
      });

      const result = await cancelTripRequestService('trip-001');
      expect(result.status).toBe('canceled');
    });

    it('returns TRIP_REQUEST_NOT_FOUND for unknown IDs', async () => {
      vi.spyOn(repository, 'getTripRequestStatus').mockResolvedValue(null);

      await expect(cancelTripRequestService('unknown-id')).rejects.toMatchObject({
        code: ErrorCodes.TRIP_REQUEST_NOT_FOUND,
      });
    });

    it('returns TRIP_REQUEST_ALREADY_CANCELED for repeated cancellation', async () => {
      vi.spyOn(repository, 'getTripRequestStatus').mockResolvedValue('canceled');

      await expect(cancelTripRequestService('trip-001')).rejects.toMatchObject({
        code: ErrorCodes.TRIP_REQUEST_ALREADY_CANCELED,
      });
    });
  });
});
