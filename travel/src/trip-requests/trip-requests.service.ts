import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';
import { isDepartureDateHoliday } from '../holidays/holidays.service.js';
import {
  parseAndNormalizeDateTime,
  toUtcDateOnly,
  toUtcIsoString,
} from '../utils/date-time.js';
import {
  cancelTripRequest,
  createTripRequest,
  findTripRequestById,
  getTripRequestStatus,
  listTripRequests,
} from './trip-requests.repository.js';
import type { CreateTripRequestInput, TripRequest } from './trip-requests.types.js';

function requireNonEmptyString(value: unknown, fieldName: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      `${fieldName} is required.`,
    );
  }
  return value.trim();
}

function parsePassengerCount(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'passengerCount must be greater than zero.',
    );
  }
  return value;
}

function validateCreateInput(body: Record<string, unknown>): CreateTripRequestInput {
  const requesterName = requireNonEmptyString(body.requesterName, 'requesterName');
  const origin = requireNonEmptyString(body.origin, 'origin');
  const destination = requireNonEmptyString(body.destination, 'destination');
  const purpose = requireNonEmptyString(body.purpose, 'purpose');
  const passengerCount = parsePassengerCount(body.passengerCount);

  const departureDate = parseAndNormalizeDateTime(body.departureAt, 'departureAt');
  const returnDate = parseAndNormalizeDateTime(body.returnAt, 'returnAt');

  if (returnDate.getTime() < departureDate.getTime()) {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'returnAt must be greater than or equal to departureAt.',
    );
  }

  return {
    requesterName,
    origin,
    destination,
    purpose,
    passengerCount,
    departureAt: toUtcIsoString(departureDate),
    returnAt: toUtcIsoString(returnDate),
  };
}

export async function createTripRequestService(
  body: Record<string, unknown>,
  fetchFn: typeof fetch = fetch,
): Promise<TripRequest> {
  const input = validateCreateInput(body);
  const departureDateOnly = toUtcDateOnly(new Date(input.departureAt));

  const isHoliday = await isDepartureDateHoliday(departureDateOnly, fetchFn);
  if (isHoliday) {
    throw new AppError(
      ErrorCodes.HOLIDAY_TRIP_NOT_ALLOWED,
      'Trip requests cannot start on a national holiday.',
    );
  }

  return createTripRequest(input);
}

export async function listTripRequestsService(): Promise<TripRequest[]> {
  return listTripRequests();
}

export async function getTripRequestByIdService(id: string): Promise<TripRequest> {
  const tripRequest = await findTripRequestById(id);
  if (!tripRequest) {
    throw new AppError(
      ErrorCodes.TRIP_REQUEST_NOT_FOUND,
      'Trip request was not found.',
    );
  }
  return tripRequest;
}

export async function cancelTripRequestService(id: string): Promise<TripRequest> {
  const existingStatus = await getTripRequestStatus(id);

  if (!existingStatus) {
    throw new AppError(
      ErrorCodes.TRIP_REQUEST_NOT_FOUND,
      'Trip request was not found.',
    );
  }

  if (existingStatus === 'canceled') {
    throw new AppError(
      ErrorCodes.TRIP_REQUEST_ALREADY_CANCELED,
      'Trip request is already canceled.',
    );
  }

  const canceled = await cancelTripRequest(id);
  if (!canceled) {
    throw new AppError(
      ErrorCodes.TRIP_REQUEST_ALREADY_CANCELED,
      'Trip request is already canceled.',
    );
  }

  return canceled;
}

export { validateCreateInput, parsePassengerCount };
