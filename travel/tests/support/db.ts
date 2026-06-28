import { pool } from "../../src/db/pool.js";
import { initializeDatabase } from "../../src/db/init-db.js";

export async function setupTestDatabase(): Promise<void> {
  await initializeDatabase();
}

export async function clearTripRequests(): Promise<void> {
  await pool.query("DELETE FROM trip_requests;");
}

export async function closeTestDatabase(): Promise<void> {
  await pool.end();
}
