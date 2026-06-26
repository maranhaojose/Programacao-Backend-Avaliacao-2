# Implementation Plan: Trip Requests API

**Branch**: `001-trip-requests-api` | **Date**: 2026-06-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-trip-requests-api/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a simplified REST API for institutional trip requests with create, list, get by ID, cancel, and list national holidays by year endpoints. The application will run on Node.js 20+ with strict TypeScript, persist all trip requests in PostgreSQL via Docker Compose, validate business rules in services, isolate BrasilAPI holiday access behind a dedicated client/service, and expose fixed JSON success/error envelopes through centralized response and error handling.

## Technical Context

**Language/Version**: TypeScript with `strict: true`, Node.js 20 or newer

**Primary Dependencies**: HTTP server framework for routes/controllers, `pg` or equivalent PostgreSQL driver, native Node.js `fetch` or equivalent HTTP client for BrasilAPI, `dotenv` for environment variables, Vitest for automated tests

**Storage**: PostgreSQL running through Docker Compose; no in-memory-only persistence

**Testing**: Vitest for unit, integration, and contract-oriented HTTP tests; BrasilAPI calls mocked or stubbed for deterministic offline execution

**Target Platform**: Node.js backend service running locally or in a server/container environment

**Project Type**: Web service / REST API

**Performance Goals**: CRUD-style trip request operations should complete within typical local API expectations; holiday validation should add only one external validation step during trip creation or holiday listing

**Constraints**: Strict TypeScript is mandatory; PostgreSQL must be initialized by an idempotent `npm run init:db`; `.env.example` must contain functional values for `NODE_ENV`, `PORT`, `DATABASE_URL`, and `HOLIDAYS_API_BASE_URL`; dates must be normalized to ISO 8601 UTC strings ending in `Z`; no static holiday preloading; external holiday unavailability blocks trip creation with HTTP 502

**Scale/Scope**: Small institutional travel management API focused on trip requests and national holiday validation; excludes authentication, drivers, vehicles, fleet scheduling, and complex approval workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Modular Component Architecture**: PASS. The planned structure separates HTTP routes/controllers, business services, repositories, external integration clients, and middleware.
- **Business Logic Belongs in Services**: PASS. Passenger count, date ordering, date normalization, cancellation behavior, and holiday blocking are assigned to service-level code.
- **Isolated External Integration**: PASS. BrasilAPI access is confined to a Holidays client/service configured through environment variables.
- **Repository-Centered Persistence**: PASS. PostgreSQL access is centralized in repositories and database initialization scripts.
- **Deterministic Tests**: PASS. Vitest is the required test framework and external holiday calls must be mocked or stubbed.
- **Strict English**: PASS. Code, comments, tests, error messages, and internal error codes must be written in English.
- **Naming and Delivery Requirements**: PASS. The plan preserves assignment-defined names, includes README and `.env.example`, excludes `node_modules`, and expects incremental English commits.
- **Standard Error Envelope**: PASS. Centralized error middleware produces `{ success: false, error: { code, message } }`.
- **Idempotent Database Initialization**: PASS. `npm run init:db` creates schema and seeds at least 10 trip requests without preloading holidays.

## Project Structure

### Documentation (this feature)

```text
specs/001-trip-requests-api/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
docker-compose.yml
package.json
tsconfig.json
.env.example
README.md
.gitignore
src/
├── app.ts
├── server.ts
├── config/
│   └── env.ts
├── db/
│   ├── pool.ts
│   └── init-db.ts
├── errors/
│   ├── app-error.ts
│   └── error-codes.ts
├── holidays/
│   ├── holidays.client.ts
│   ├── holidays.service.ts
│   └── holidays.types.ts
├── middleware/
│   ├── error-handler.ts
│   └── response.ts
├── trip-requests/
│   ├── trip-requests.controller.ts
│   ├── trip-requests.repository.ts
│   ├── trip-requests.routes.ts
│   ├── trip-requests.service.ts
│   └── trip-requests.types.ts
└── utils/
    └── date-time.ts
tests/
├── unit/
│   ├── holidays.service.test.ts
│   └── trip-requests.service.test.ts
├── integration/
│   ├── trip-requests.routes.test.ts
│   └── holidays.routes.test.ts
└── support/
    ├── brasilapi.stub.ts
    └── db.ts
```

**Structure Decision**: Use a single backend project because the product is a REST API without frontend, mobile app, or separate packages. Feature modules group route/controller, service, repository, and types while shared middleware, errors, database, config, and date utilities remain in top-level infrastructure folders.

## API Plan

All success responses use:

```json
{
  "success": true,
  "data": {}
}
```

All error responses use:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "English error message"
  }
}
```

Planned endpoints:

- `POST /trip-requests`: create a trip request after validation and holiday check.
- `GET /trip-requests`: list all trip requests.
- `GET /trip-requests/{id}`: return one trip request or `TRIP_REQUEST_NOT_FOUND`.
- `PATCH /trip-requests/{id}/cancel`: mark a pending trip request as canceled or return `TRIP_REQUEST_ALREADY_CANCELED`.
- `GET /holidays/{year}`: list national holidays for a year through the same response envelope.

## Business Rule Enforcement

- Controllers only parse route parameters and request bodies, then delegate to services.
- Trip request service validates `passengerCount` as a whole number greater than zero.
- Trip request service validates `returnAt >= departureAt`.
- Trip request service requires `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, and `passengerCount`.
- Trip request service creates records with status `pending` and changes only pending records to `canceled`.
- Trip request service raises `TRIP_REQUEST_ALREADY_CANCELED` for repeated cancellation attempts.
- Date utility parses accepted date inputs and normalizes persisted/returned values using UTC ISO 8601 strings with the `Z` suffix.
- Trip request service asks Holidays service whether the normalized departure date is a national holiday before repository insertion.
- Holidays service calls the BrasilAPI client at `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}`. If holiday validation cannot be completed, the service raises an upstream dependency error mapped to HTTP 502.
- Repository performs all PostgreSQL reads and writes and never calls BrasilAPI.
- Centralized error middleware maps validation, not-found, holiday conflict, and upstream dependency failures to coherent HTTP statuses and UPPER_SNAKE_CASE codes.
- Exact required error codes: `VALIDATION_ERROR`, `TRIP_REQUEST_NOT_FOUND`, `TRIP_REQUEST_ALREADY_CANCELED`, `HOLIDAY_TRIP_NOT_ALLOWED`, `HOLIDAYS_API_UNAVAILABLE`, and `INTERNAL_SERVER_ERROR`.

## Database Plan

- PostgreSQL runs in Docker Compose through a functional `docker-compose.yml`.
- Database credentials and BrasilAPI base URL are configured through `DATABASE_URL` and `HOLIDAYS_API_BASE_URL`.
- `npm run init:db` executes a TypeScript database initializer or compiled equivalent.
- Initialization creates required schema with `CREATE TABLE IF NOT EXISTS`.
- Seed data uses stable IDs or conflict-safe inserts so the script is idempotent.
- The seed inserts at least 10 trip request records and does not seed holiday records.
- The database stores timestamp values in UTC-compatible columns and application responses serialize them as ISO 8601 UTC strings ending in `Z`.

## Testing Plan

- Unit tests cover service validation for passenger count, date ordering, UTC normalization, holiday blocking, cancellation behavior, and error mapping.
- Integration tests cover all endpoints and fixed success/error envelopes.
- Minimum required test scenarios: valid creation, `returnAt` earlier than `departureAt`, invalid `passengerCount`, holiday departure blocking, missing trip request lookup, successful cancellation, and already canceled cancellation.
- BrasilAPI is mocked or stubbed in all tests; no test depends on real external network availability.
- Repository or integration tests use a test database setup that can be initialized repeatedly.
- Required scripts in `package.json`: `dev`, `start`, `test`, and `init:db`.

## Delivery Plan

- README documents team name if any, full member names, API summary, technologies, chosen SGBD, package manager, dependency installation, environment configuration, Docker Compose database startup, database initialization and seeding, application execution, test execution, and endpoint summary with request body examples.
- `.env.example` contains functional values that allow local execution without manual edits: `NODE_ENV=development`, `PORT=3000`, `DATABASE_URL` compatible with `docker-compose.yml`, and `HOLIDAYS_API_BASE_URL=https://brasilapi.com.br`.
- `.gitignore` excludes `node_modules`, `.env`, build output, coverage output, and local editor/runtime artifacts.
- Git history should contain more than one relevant commit with clear English messages that show incremental development.
- Before delivery, validate the project from a clean clone using only the README commands.

## Post-Design Constitution Check

- **Modular Component Architecture**: PASS. Source layout preserves clear module boundaries.
- **Business Logic Belongs in Services**: PASS. All required validation is assigned to services.
- **Isolated External Integration**: PASS. BrasilAPI remains behind `holidays.client.ts` and `holidays.service.ts`.
- **Repository-Centered Persistence**: PASS. SQL is confined to repository and database initialization code.
- **Deterministic Tests**: PASS. Vitest and stubs are explicitly required.
- **Strict English**: PASS. Error contracts and implementation guidance require English.
- **Naming and Delivery Requirements**: PASS. Assignment-defined names, environment variables, README, `.env.example`, GitHub delivery, and commit-history expectations are documented.
- **Standard Error Envelope**: PASS. Middleware and contracts enforce the error shape.
- **Idempotent Database Initialization**: PASS. Database plan requires conflict-safe schema and seed execution.

## Complexity Tracking

No constitution violations require justification.
