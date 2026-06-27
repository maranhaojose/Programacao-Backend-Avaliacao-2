# Trip Requests API

REST API for institutional trip request management with PostgreSQL persistence, BrasilAPI holiday validation, and fixed JSON response envelopes.

## Team

- Add full team member names before delivery.

## Tech Stack

- Node.js 20+
- TypeScript with strict mode
- Express
- PostgreSQL through Docker Compose
- Vitest

## Setup

```bash
npm install
cp .env.example .env
docker compose up -d
npm run init:db
```

## Scripts

- `npm run dev`: run the development server.
- `npm run build`: compile TypeScript to `dist/`.
- `npm run start`: run the compiled server.
- `npm run test`: run the Vitest suite.
- `npm run init:db`: create and seed the PostgreSQL schema.

## Database

The local database runs with Docker Compose and matches the default `DATABASE_URL` in `.env.example`.

## Tests

Tests use Vitest. BrasilAPI behavior should be mocked or stubbed so the suite runs deterministically without external network access.

## Endpoints

- `POST /trip-requests`
- `GET /trip-requests`
- `GET /trip-requests/{id}`
- `PATCH /trip-requests/{id}/cancel`
- `GET /holidays/{year}`
