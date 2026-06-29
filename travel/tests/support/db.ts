import type pg from 'pg';
import { initializeDatabase } from '../../src/db/init-db.js';

export async function setupTestDatabase(): Promise<void> {
  await initializeDatabase();
}

export async function truncateTripRequests(pool: pg.Pool): Promise<void> {
  await pool.query('TRUNCATE TABLE trip_requests;');
}

export async function cleanupTripRequests(pool: pg.Pool): Promise<void> {
  await truncateTripRequests(pool);
  await setupTestDatabase();
}
