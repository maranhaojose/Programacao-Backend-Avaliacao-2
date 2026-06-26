# Travel API Constitution

## Core Principles

### I. Modular Component Architecture
The project MUST use a modular component architecture that separates responsibilities without introducing unnecessary Clean Architecture or DDD ceremony. HTTP routes/controllers capture request data and delegate business decisions. Services hold validation and business rules. Repositories centralize database access. External integrations live in isolated clients/services. Cross-cutting error handling is implemented through centralized middleware.

### II. Business Logic Belongs in Services
Business rules MUST NOT be implemented directly in controllers or repositories. Validation rules such as `passengerCount > 0`, `returnAt >= departureAt`, and holiday conflict checks MUST be implemented in service-level code where they can be tested independently.

### III. Isolated External Integration
The BrasilAPI holiday integration MUST be isolated in a dedicated Holidays client/service. This component is solely responsible for using native `fetch`, calling BrasilAPI, and normalizing holiday responses for the rest of the application. Controllers, repositories, and unrelated services MUST NOT call BrasilAPI directly.

### IV. Repository-Centered Persistence
All PostgreSQL/MySQL access MUST go through repositories. SQL queries, inserts, and updates MUST NOT be scattered through controllers or business services. Database access MUST be compatible with the Docker Compose database used by the project.

### V. Deterministic Tests
The test suite MUST use Vitest and cover required success and error scenarios. BrasilAPI MUST be mocked or stubbed in tests so the suite is deterministic, offline, and independent from external network availability.

## Technical Constraints

The project MUST use strict English for all code, commits, comments, API error codes, API error messages, and test descriptions.

All API failures MUST be returned through the standard error envelope:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

Unhandled exceptions MUST be captured by centralized error middleware and converted into the standard error envelope.

The `npm run init:db` command MUST be idempotent. It MUST be safe to run multiple times without breaking existing data or constraints. It MUST seed at least 10 initial travel records and MUST NOT preload holiday data.

Code identifiers MUST follow the assignment naming conventions: camelCase for variables, functions, methods, properties, parameters, and local constants; PascalCase for classes, interfaces, types, and enums; kebab-case for files and directories. Technical names defined by the assignment MUST be preserved exactly, including `trip-requests`, `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, `passengerCount`, `NODE_ENV`, `PORT`, `DATABASE_URL`, and `HOLIDAYS_API_BASE_URL`.

The delivered repository MUST include a functional `.env.example`, `docker-compose.yml`, `package.json`, README instructions, no committed `node_modules`, and a clear incremental Git commit history with English commit messages.

## Development Workflow

Every feature or fix MUST preserve the architecture boundaries defined in this constitution. New routes/controllers only coordinate HTTP concerns. New services own business decisions. New repositories own database operations. New external API behavior belongs in an integration client/service.

Before implementation is considered complete, tests MUST verify relevant success paths, validation errors, external integration behavior through mocks/stubs, repository behavior where applicable, and standard error response formatting.

## Governance

This constitution supersedes conflicting local preferences or ad hoc implementation choices. Changes that increase architectural complexity MUST be justified by a concrete project need. Pull requests and reviews MUST verify compliance with the modular architecture, strict English rule, deterministic testing, idempotent database initialization, and standard error envelope.

**Version**: 1.0.0 | **Ratified**: 2026-06-26 | **Last Amended**: 2026-06-26
