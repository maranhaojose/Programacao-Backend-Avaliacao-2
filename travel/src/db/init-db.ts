<<<<<<< HEAD
import { pool, closePool } from "./pool.js";

const createTableSql = `
=======
import { pool } from './pool.js';

const CREATE_TABLE_SQL = `
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  CREATE TABLE IF NOT EXISTS trip_requests (
    id TEXT PRIMARY KEY,
    requester_name TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
<<<<<<< HEAD
    departure_at TIMESTAMPTZ NOT NULL,
    return_at TIMESTAMPTZ NOT NULL,
    purpose TEXT NOT NULL,
    passenger_count INTEGER NOT NULL CHECK (passenger_count > 0),
=======
    purpose TEXT NOT NULL,
    passenger_count INTEGER NOT NULL,
    departure_at TIMESTAMPTZ NOT NULL,
    return_at TIMESTAMPTZ NOT NULL,
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
    status TEXT NOT NULL CHECK (status IN ('pending', 'canceled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

<<<<<<< HEAD
const seedTripRequests = [
  {
    id: "seed-trip-request-001",
    requesterName: "Maria Silva",
    origin: "Parnaiba",
    destination: "Teresina",
    departureAt: "2026-06-24T10:00:00.000Z",
    returnAt: "2026-06-24T18:00:00.000Z",
    purpose: "Participation in an institutional meeting",
    passengerCount: 3,
    status: "pending",
    createdAt: "2026-06-20T14:30:00.000Z",
  },
  {
    id: "seed-trip-request-002",
    requesterName: "Joao Santos",
    origin: "Teresina",
    destination: "Floriano",
    departureAt: "2026-07-02T08:00:00.000Z",
    returnAt: "2026-07-02T17:30:00.000Z",
    purpose: "Campus infrastructure inspection",
    passengerCount: 2,
    status: "pending",
    createdAt: "2026-06-21T09:10:00.000Z",
  },
  {
    id: "seed-trip-request-003",
    requesterName: "Ana Costa",
    origin: "Parnaiba",
    destination: "Piripiri",
    departureAt: "2026-07-08T11:00:00.000Z",
    returnAt: "2026-07-09T19:00:00.000Z",
    purpose: "Academic project monitoring",
    passengerCount: 4,
    status: "pending",
    createdAt: "2026-06-22T11:45:00.000Z",
  },
  {
    id: "seed-trip-request-004",
    requesterName: "Carlos Almeida",
    origin: "Teresina",
    destination: "Picos",
    departureAt: "2026-07-14T07:30:00.000Z",
    returnAt: "2026-07-14T20:00:00.000Z",
    purpose: "Administrative training session",
    passengerCount: 1,
    status: "canceled",
    createdAt: "2026-06-23T16:20:00.000Z",
  },
  {
    id: "seed-trip-request-005",
    requesterName: "Fernanda Lima",
    origin: "Parnaiba",
    destination: "Campo Maior",
    departureAt: "2026-07-20T09:00:00.000Z",
    returnAt: "2026-07-20T16:00:00.000Z",
    purpose: "Community outreach visit",
    passengerCount: 5,
    status: "pending",
    createdAt: "2026-06-24T08:05:00.000Z",
  },
  {
    id: "seed-trip-request-006",
    requesterName: "Rafael Sousa",
    origin: "Teresina",
    destination: "Oeiras",
    departureAt: "2026-08-03T10:30:00.000Z",
    returnAt: "2026-08-04T15:30:00.000Z",
    purpose: "Research field activity",
    passengerCount: 6,
    status: "pending",
    createdAt: "2026-06-25T10:15:00.000Z",
  },
  {
    id: "seed-trip-request-007",
    requesterName: "Beatriz Rocha",
    origin: "Parnaiba",
    destination: "Luis Correia",
    departureAt: "2026-08-10T13:00:00.000Z",
    returnAt: "2026-08-10T18:30:00.000Z",
    purpose: "Extension program supervision",
    passengerCount: 3,
    status: "pending",
    createdAt: "2026-06-26T13:25:00.000Z",
  },
  {
    id: "seed-trip-request-008",
    requesterName: "Pedro Martins",
    origin: "Teresina",
    destination: "Barras",
    departureAt: "2026-08-18T06:45:00.000Z",
    returnAt: "2026-08-18T17:45:00.000Z",
    purpose: "Technical equipment delivery",
    passengerCount: 2,
    status: "canceled",
    createdAt: "2026-06-27T07:40:00.000Z",
  },
  {
    id: "seed-trip-request-009",
    requesterName: "Juliana Pereira",
    origin: "Parnaiba",
    destination: "Cocal",
    departureAt: "2026-08-25T12:00:00.000Z",
    returnAt: "2026-08-25T21:00:00.000Z",
    purpose: "Student assistance meeting",
    passengerCount: 4,
    status: "pending",
    createdAt: "2026-06-27T15:55:00.000Z",
  },
  {
    id: "seed-trip-request-010",
    requesterName: "Lucas Ferreira",
    origin: "Teresina",
    destination: "Sao Raimundo Nonato",
    departureAt: "2026-09-01T05:30:00.000Z",
    returnAt: "2026-09-02T22:00:00.000Z",
    purpose: "Institutional partnership agenda",
    passengerCount: 3,
    status: "pending",
    createdAt: "2026-06-28T12:00:00.000Z",
  },
] as const;

async function seedDatabase(): Promise<void> {
  for (const tripRequest of seedTripRequests) {
    await pool.query(
      `
        INSERT INTO trip_requests (
          id,
          requester_name,
          origin,
          destination,
          departure_at,
          return_at,
          purpose,
          passenger_count,
          status,
          created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;
      `,
      [
        tripRequest.id,
        tripRequest.requesterName,
        tripRequest.origin,
        tripRequest.destination,
        tripRequest.departureAt,
        tripRequest.returnAt,
        tripRequest.purpose,
        tripRequest.passengerCount,
        tripRequest.status,
        tripRequest.createdAt,
      ],
    );
  }
}

export async function initializeDatabase(): Promise<void> {
  await pool.query(createTableSql);
  await seedDatabase();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(async () => {
      console.log("Database initialized successfully.");
      await closePool();
    })
    .catch(async (error: unknown) => {
      console.error("Database initialization failed.", error);
      await closePool();
      process.exitCode = 1;
    });
=======
interface SeedRecord {
  id: string;
  requesterName: string;
  origin: string;
  destination: string;
  purpose: string;
  passengerCount: number;
  departureAt: string;
  returnAt: string;
  status: 'pending' | 'canceled';
  createdAt: string;
}

const SEED_RECORDS: SeedRecord[] = [
  {
    id: 'seed-001',
    requesterName: 'Maria Silva',
    origin: 'Parnaiba',
    destination: 'Teresina',
    purpose: 'Institutional meeting',
    passengerCount: 3,
    departureAt: '2026-03-10T10:00:00.000Z',
    returnAt: '2026-03-10T18:00:00.000Z',
    status: 'pending',
    createdAt: '2026-03-01T12:00:00.000Z',
  },
  {
    id: 'seed-002',
    requesterName: 'Joao Santos',
    origin: 'Teresina',
    destination: 'Fortaleza',
    purpose: 'Training workshop',
    passengerCount: 2,
    departureAt: '2026-04-15T08:00:00.000Z',
    returnAt: '2026-04-17T17:00:00.000Z',
    status: 'pending',
    createdAt: '2026-03-05T09:30:00.000Z',
  },
  {
    id: 'seed-003',
    requesterName: 'Ana Costa',
    origin: 'Picos',
    destination: 'Teresina',
    purpose: 'Medical appointment coordination',
    passengerCount: 1,
    departureAt: '2026-05-02T07:30:00.000Z',
    returnAt: '2026-05-02T16:00:00.000Z',
    status: 'pending',
    createdAt: '2026-04-20T14:00:00.000Z',
  },
  {
    id: 'seed-004',
    requesterName: 'Carlos Oliveira',
    origin: 'Floriano',
    destination: 'Brasilia',
    purpose: 'Government audit support',
    passengerCount: 4,
    departureAt: '2026-06-08T06:00:00.000Z',
    returnAt: '2026-06-12T20:00:00.000Z',
    status: 'pending',
    createdAt: '2026-05-25T11:15:00.000Z',
  },
  {
    id: 'seed-005',
    requesterName: 'Fernanda Lima',
    origin: 'Teresina',
    destination: 'Sao Luis',
    purpose: 'Partnership negotiation',
    passengerCount: 2,
    departureAt: '2026-07-14T09:00:00.000Z',
    returnAt: '2026-07-15T19:00:00.000Z',
    status: 'pending',
    createdAt: '2026-06-01T08:45:00.000Z',
  },
  {
    id: 'seed-006',
    requesterName: 'Pedro Almeida',
    origin: 'Campo Maior',
    destination: 'Teresina',
    purpose: 'Equipment delivery supervision',
    passengerCount: 1,
    departureAt: '2026-08-20T11:00:00.000Z',
    returnAt: '2026-08-20T15:30:00.000Z',
    status: 'pending',
    createdAt: '2026-07-10T16:20:00.000Z',
  },
  {
    id: 'seed-007',
    requesterName: 'Juliana Rocha',
    origin: 'Teresina',
    destination: 'Recife',
    purpose: 'Academic conference',
    passengerCount: 3,
    departureAt: '2026-09-05T13:00:00.000Z',
    returnAt: '2026-09-08T22:00:00.000Z',
    status: 'pending',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 'seed-008',
    requesterName: 'Ricardo Mendes',
    origin: 'Oeiras',
    destination: 'Teresina',
    purpose: 'Budget review session',
    passengerCount: 2,
    departureAt: '2026-10-12T08:30:00.000Z',
    returnAt: '2026-10-12T17:30:00.000Z',
    status: 'canceled',
    createdAt: '2026-09-15T13:40:00.000Z',
  },
  {
    id: 'seed-009',
    requesterName: 'Beatriz Ferreira',
    origin: 'Teresina',
    destination: 'Palmas',
    purpose: 'Regional coordination meeting',
    passengerCount: 5,
    departureAt: '2026-11-03T07:00:00.000Z',
    returnAt: '2026-11-04T18:00:00.000Z',
    status: 'pending',
    createdAt: '2026-10-01T09:10:00.000Z',
  },
  {
    id: 'seed-010',
    requesterName: 'Lucas Pereira',
    origin: 'Piripiri',
    destination: 'Teresina',
    purpose: 'Student enrollment support',
    passengerCount: 2,
    departureAt: '2026-12-09T10:15:00.000Z',
    returnAt: '2026-12-09T16:45:00.000Z',
    status: 'pending',
    createdAt: '2026-11-20T15:55:00.000Z',
  },
];

const INSERT_SEED_SQL = `
  INSERT INTO trip_requests (
    id,
    requester_name,
    origin,
    destination,
    purpose,
    passenger_count,
    departure_at,
    return_at,
    status,
    created_at
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
  )
  ON CONFLICT (id) DO NOTHING;
`;

export async function initializeDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(CREATE_TABLE_SQL);

    for (const record of SEED_RECORDS) {
      await client.query(INSERT_SEED_SQL, [
        record.id,
        record.requesterName,
        record.origin,
        record.destination,
        record.purpose,
        record.passengerCount,
        record.departureAt,
        record.returnAt,
        record.status,
        record.createdAt,
      ]);
    }
  } finally {
    client.release();
  }
}

async function main(): Promise<void> {
  try {
    await initializeDatabase();
    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

const isDirectExecution = process.argv[1]?.includes('init-db');

if (isDirectExecution) {
  void main();
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
}
