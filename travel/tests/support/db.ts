<<<<<<< HEAD
import { pool } from "../../src/db/pool.js";
import { initializeDatabase } from "../../src/db/init-db.js";
=======
import pg from 'pg';
import { initializeDatabase } from '../../src/db/init-db.js';

const { Pool } = pg;

export function getTestPool(): pg.Pool {
  const connectionString =
    process.env.DATABASE_URL ??
    'postgres://trip_user:trip_password@localhost:5432/trip_requests';

  return new Pool({ connectionString });
}
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))

export async function setupTestDatabase(): Promise<void> {
  await initializeDatabase();
}

<<<<<<< HEAD
export async function clearTripRequests(): Promise<void> {
  await pool.query("DELETE FROM trip_requests;");
}

export async function closeTestDatabase(): Promise<void> {
=======
export async function cleanupTripRequests(pool: pg.Pool): Promise<void> {
  await pool.query('DELETE FROM trip_requests');
  await initializeDatabase();
}

export async function truncateTripRequests(pool: pg.Pool): Promise<void> {
  await pool.query('DELETE FROM trip_requests');
}

export async function closePool(pool: pg.Pool): Promise<void> {
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  await pool.end();
}
