# Quickstart: Trip Requests API

## Prerequisites

- Node.js 20 or newer.
- Docker and Docker Compose.
- A package manager compatible with `package.json` scripts; npm is the default in this plan.

## Environment

Create an environment file from the project example after implementation:

```bash
cp .env.example .env
```

Required values:

- `NODE_ENV`: Execution environment, expected to default to `development`.
- `PORT`: HTTP port, for example `3000`.
- `DATABASE_URL`: PostgreSQL connection string for the Docker Compose database.
- `HOLIDAYS_API_BASE_URL`: Base URL for the holiday source, expected to default to `https://brasilapi.com.br`.

`.env.example` must contain functional values for all required variables. The project must either work from those default values directly or allow copying `.env.example` to `.env` without manual edits.

Holiday requests are made against `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}`.

## Setup

```bash
npm install
docker compose up -d
npm run init:db
```

Expected result:

- PostgreSQL is running through Docker Compose.
- Database tables exist.
- At least 10 trip requests are seeded with `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, `passengerCount`, `status`, and `createdAt`.
- No holiday rows are preloaded.
- Running `npm run init:db` again succeeds without duplicate or constraint failures.

## Run

```bash
npm run dev
```

For production-style execution after build:

```bash
npm run start
```

## Test

```bash
npm run test
```

Expected result:

- Vitest runs all unit and integration tests.
- BrasilAPI behavior is mocked or stubbed.
- Tests cover valid creation, invalid passenger count, `returnAt` earlier than `departureAt`, national holiday blocking, upstream holiday unavailability, missing trip request lookup, successful cancellation, already canceled cancellation, holiday listing, and fixed response envelopes.

## Manual Validation Scenarios

### Create a valid trip request

Send `POST /trip-requests` with `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, and a positive `passengerCount` for a non-holiday departure date. Expect HTTP 201 and:

```json
{
  "success": true,
  "data": {
    "status": "pending"
  }
}
```

Dates in the returned data must use ISO 8601 UTC with `Z`.

### Block a national holiday departure

Send `POST /trip-requests` with a departure date that matches a national holiday. Expect HTTP 409 and:

```json
{
  "success": false,
  "error": {
    "code": "HOLIDAY_TRIP_NOT_ALLOWED",
    "message": "Trip requests cannot start on a national holiday."
  }
}
```

### Block when holiday validation is unavailable

Simulate the holiday source being unavailable during trip creation. Expect HTTP 502 and:

```json
{
  "success": false,
  "error": {
    "code": "HOLIDAYS_API_UNAVAILABLE",
    "message": "Holidays API is unavailable."
  }
}
```

### List, view, and cancel

- `GET /trip-requests` returns all trip requests with `success: true`.
- `GET /trip-requests/{id}` returns one trip request or `TRIP_REQUEST_NOT_FOUND`.
- `PATCH /trip-requests/{id}/cancel` returns the canceled trip request with `status: "canceled"`.
- Repeating `PATCH /trip-requests/{id}/cancel` returns `TRIP_REQUEST_ALREADY_CANCELED`.

### List holidays by year

Send `GET /holidays/{year}`. Expect HTTP 200 with `success: true` and a `data` array of holiday records, or HTTP 502 when the holiday source is unavailable.

## Delivery Checklist

- README includes all team members, package manager, chosen SGBD, setup, execution, tests, and endpoint documentation.
- `.env.example` values run locally without manual edits.
- `docker-compose.yml` starts the database service.
- `package.json` includes `dev`, `start`, `init:db`, and `test`.
- `node_modules` is not versioned.
- Git history contains multiple relevant English commits.
