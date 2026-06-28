import { randomUUID } from 'node:crypto';
import { pool } from '../db/pool.js';
import { toUtcIsoString } from '../utils/date-time.js';
import type {
  CreateTripRequestInput,
  TripRequest,
  TripRequestRow,
  TripRequestStatus,
} from './trip-requests.types.js';

function mapRowToTripRequest(row: TripRequestRow): TripRequest {
  return {
    id: row.id,
    requesterName: row.requester_name,
    origin: row.origin,
    destination: row.destination,
    purpose: row.purpose,
    passengerCount: row.passenger_count,
    departureAt: toUtcIsoString(row.departure_at),
    returnAt: toUtcIsoString(row.return_at),
    status: row.status,
    createdAt: toUtcIsoString(row.created_at),
  };
}

export async function createTripRequest(
  input: CreateTripRequestInput,
  status: TripRequestStatus = 'pending',
): Promise<TripRequest> {
  const id = randomUUID();
  const result = await pool.query<TripRequestRow>(
    `INSERT INTO trip_requests (
      id,
      requester_name,
      origin,
      destination,
      purpose,
      passenger_count,
      departure_at,
      return_at,
      status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
    [
      id,
      input.requesterName,
      input.origin,
      input.destination,
      input.purpose,
      input.passengerCount,
      input.departureAt,
      input.returnAt,
      status,
    ],
  );

  return mapRowToTripRequest(result.rows[0]);
}

export async function listTripRequests(): Promise<TripRequest[]> {
  const result = await pool.query<TripRequestRow>(
    'SELECT * FROM trip_requests ORDER BY created_at ASC',
  );
  return result.rows.map(mapRowToTripRequest);
}

export async function findTripRequestById(id: string): Promise<TripRequest | null> {
  const result = await pool.query<TripRequestRow>(
    'SELECT * FROM trip_requests WHERE id = $1',
    [id],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRowToTripRequest(result.rows[0]);
}

export async function cancelTripRequest(id: string): Promise<TripRequest | null> {
  const result = await pool.query<TripRequestRow>(
    `UPDATE trip_requests
     SET status = 'canceled'
     WHERE id = $1 AND status = 'pending'
     RETURNING *`,
    [id],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return mapRowToTripRequest(result.rows[0]);
}

export async function getTripRequestStatus(id: string): Promise<TripRequestStatus | null> {
  const result = await pool.query<{ status: TripRequestStatus }>(
    'SELECT status FROM trip_requests WHERE id = $1',
    [id],
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0].status;
}
