# Research: Trip Requests API

## Decision: Use Node.js 20+ with strict TypeScript

**Rationale**: Node.js 20+ provides native `fetch`, stable modern runtime behavior, and native support for the backend service style required by the project. Strict TypeScript improves correctness around request DTOs, domain models, normalized dates, repository rows, and error codes.

**Alternatives considered**: Plain JavaScript was rejected because the plan requires strict typing. Older Node.js versions were rejected because the runtime must be version 20 or newer and native `fetch` support is useful for BrasilAPI.

## Decision: Use PostgreSQL through Docker Compose

**Rationale**: PostgreSQL satisfies the relational persistence requirement and avoids an in-memory-only implementation. Docker Compose gives a repeatable local database environment for development and testing.

**Alternatives considered**: SQLite and in-memory stores were rejected because the plan requires PostgreSQL and durable relational persistence. A hosted database was rejected for local coursework simplicity and reproducibility.

## Decision: Use a modular backend layout with routes/controllers, services, repositories, middleware, and integration clients

**Rationale**: This structure satisfies the constitution while staying lighter than full Clean Architecture or DDD. It keeps HTTP concerns, business rules, persistence, external integrations, and cross-cutting error handling independently testable.

**Alternatives considered**: Putting SQL and validation directly in controllers was rejected because it violates the constitution and makes tests brittle. A full multi-layer enterprise architecture was rejected as unnecessary complexity for the project scope.

## Decision: Isolate BrasilAPI behind Holidays client/service

**Rationale**: Holiday validation is the central external dependency and must be mocked in tests. A dedicated client/service keeps URL configuration, `fetch` behavior, response normalization, and upstream failure handling in one place.

**Alternatives considered**: Direct calls from trip request services or controllers were rejected because they mix responsibilities. Preloading holidays was rejected because the requirements forbid static holiday loading.

## Decision: Configure BrasilAPI through HOLIDAYS_API_BASE_URL

**Rationale**: The assignment requires the base URL to come from `HOLIDAYS_API_BASE_URL`, with `https://brasilapi.com.br` as the functional default. The holidays client will compose the required endpoint as `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}`.

**Alternatives considered**: Hardcoding the full URL was rejected because the assignment requires environment-based configuration and test suites need to redirect holiday calls to mocks, stubs, or fake HTTP services.

## Decision: Normalize dates in application services and serialize as ISO 8601 UTC with `Z`

**Rationale**: Central date normalization prevents inconsistent persistence and response formatting. The service layer is the correct place to enforce `returnAt >= departureAt` and to decide the normalized departure date used for holiday checks.

**Alternatives considered**: Relying only on database timezone conversion was rejected because API response formatting still needs explicit control. Keeping client-provided date strings unchanged was rejected because the specification requires UTC normalization.

## Decision: Use Vitest with mocked BrasilAPI behavior

**Rationale**: Vitest covers unit and integration-style tests in a TypeScript project with fast feedback. Stubbing the holiday client ensures success, holiday conflict, and upstream failure scenarios are deterministic and offline.

**Alternatives considered**: Tests against the real BrasilAPI were rejected because they would be flaky and violate the constitution. Manual-only validation was rejected because error and success scenarios must be covered automatically.

## Decision: Use fixed JSON envelopes for all responses

**Rationale**: A single success envelope and a single error envelope make endpoint behavior predictable and easy to test. Centralized response helpers and error middleware prevent inconsistent controller responses.

**Alternatives considered**: Returning raw resources or framework-default errors was rejected because the project requires strict response contracts.
