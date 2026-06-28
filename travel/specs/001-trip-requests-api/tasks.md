# Tasks: Trip Requests API

**Input**: Design documents from `specs/001-trip-requests-api/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/openapi.yaml, quickstart.md

**Tests**: Required by the feature specification and assignment. Vitest test tasks are included before implementation tasks for each user story.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on incomplete tasks.
- **[Story]**: Maps the task to a user story from spec.md.
- Every task includes an exact file path.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the TypeScript/Node.js backend project, package scripts, Docker database, and required delivery files.

- [x] T001 Create package manifest with `dev`, `start`, `test`, and `init:db` scripts in package.json
- [x] T002 Configure strict TypeScript with `strict: true`, Node.js 20 module resolution, and build output in tsconfig.json
- [x] T003 [P] Create functional environment example with `NODE_ENV`, `PORT`, `DATABASE_URL`, and `HOLIDAYS_API_BASE_URL` in .env.example
- [x] T004 [P] Create Docker Compose PostgreSQL service compatible with `DATABASE_URL` in docker-compose.yml
- [x] T005 [P] Create repository ignore rules for `node_modules`, `.env`, build output, and coverage in .gitignore
- [x] T006 [P] Create project directory skeleton for source and tests in src/ and tests/
- [x] T007 [P] Add initial README structure with team, setup, scripts, database, tests, and endpoints sections in README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story can be implemented.

**Critical**: No user story work can begin until this phase is complete.

- [x] T008 Configure environment loading and validation in src/config/env.ts
- [x] T009 Configure PostgreSQL connection pool using `DATABASE_URL` in src/db/pool.ts
- [x] T010 Create idempotent database initializer with trip request schema and 10 seed records in src/db/init-db.ts
- [x] T011 [P] Define application error codes and HTTP status mapping in src/errors/error-codes.ts
- [x] T012 [P] Implement AppError class with UPPER_SNAKE_CASE code support in src/errors/app-error.ts
- [x] T013 [P] Implement fixed success response helper `{ success: true, data }` in src/middleware/response.ts
- [x] T014 Implement centralized error middleware with `{ success: false, error: { code, message } }` in src/middleware/error-handler.ts
- [x] T015 [P] Implement UTC ISO 8601 parsing and normalization helpers in src/utils/date-time.ts
- [x] T016 [P] Define TripRequest, input DTO, status, and repository row types in src/trip-requests/trip-requests.types.ts
- [x] T017 [P] Define Holiday and holiday client response types in src/holidays/holidays.types.ts
- [x] T018 Create Express app wiring JSON parsing, response helpers, routes, and error middleware in src/app.ts
- [x] T019 Create Node.js server bootstrap using configured `PORT` in src/server.ts
- [x] T020 [P] Create Vitest configuration for TypeScript tests in vitest.config.ts
- [x] T021 [P] Create shared BrasilAPI test stub utilities in tests/support/brasilapi.stub.ts
- [x] T022 [P] Create shared database test helpers for setup and cleanup in tests/support/db.ts

**Checkpoint**: Foundation ready. User story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Create a Valid Trip Request (Priority: P1) MVP

**Goal**: Users can create a trip request with required fields, normalized UTC dates, initial `pending` status, PostgreSQL persistence, holiday blocking, and fixed response envelopes.

**Independent Test**: Submit valid and invalid `POST /trip-requests` requests and verify HTTP 201, HTTP 400, HTTP 409, HTTP 502, date normalization, persistence, and fixed JSON envelopes.

### Tests for User Story 1

- [x] T023 [P] [US1] Add unit tests for date normalization and invalid date handling in tests/unit/date-time.test.ts
- [x] T024 [P] [US1] Add unit tests for BrasilAPI success, normalization, and upstream failure behavior in tests/unit/holidays.service.test.ts
- [x] T025 [P] [US1] Add unit tests for create validation rules and holiday blocking in tests/unit/trip-requests.service.test.ts
- [x] T026 [P] [US1] Add integration tests for `POST /trip-requests` success and validation failures in tests/integration/trip-requests.routes.test.ts
- [x] T027 [P] [US1] Add integration tests for holiday conflict and unavailable holiday API on creation in tests/integration/trip-requests.routes.test.ts

### Implementation for User Story 1

- [x] T028 [P] [US1] Implement BrasilAPI holidays client using `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}` in src/holidays/holidays.client.ts
- [x] T029 [US1] Implement holidays service for list-by-year, date matching, and `HOLIDAYS_API_UNAVAILABLE` mapping in src/holidays/holidays.service.ts
- [x] T030 [P] [US1] Implement trip request repository create and row mapping functions in src/trip-requests/trip-requests.repository.ts
- [x] T031 [US1] Implement trip request creation service with required field, passenger count, date range, UTC normalization, holiday validation, and `pending` status in src/trip-requests/trip-requests.service.ts
- [x] T032 [US1] Implement create trip request controller action in src/trip-requests/trip-requests.controller.ts
- [x] T033 [US1] Register `POST /trip-requests` route in src/trip-requests/trip-requests.routes.ts
- [x] T034 [US1] Mount trip request routes in src/app.ts

**Checkpoint**: User Story 1 is fully functional and testable as the MVP.

---

## Phase 4: User Story 2 - List Trip Requests (Priority: P2)

**Goal**: Users can list all persisted trip requests with normalized dates, current status, and the fixed success envelope.

**Independent Test**: Run the seeded database or create records, request `GET /trip-requests`, and verify HTTP 200 with all trip requests or an empty list.

### Tests for User Story 2

- [x] T035 [P] [US2] Add integration tests for `GET /trip-requests` returning seeded records and an empty list in tests/integration/trip-requests.routes.test.ts

### Implementation for User Story 2

- [x] T036 [US2] Implement repository list and row mapping for trip requests in src/trip-requests/trip-requests.repository.ts
- [x] T037 [US2] Implement list trip requests service method in src/trip-requests/trip-requests.service.ts
- [x] T038 [US2] Implement list trip requests controller action in src/trip-requests/trip-requests.controller.ts
- [x] T039 [US2] Register `GET /trip-requests` route in src/trip-requests/trip-requests.routes.ts

**Checkpoint**: User Story 2 works independently after foundation and can be validated with seeded data.

---

## Phase 5: User Story 3 - View a Trip Request by ID (Priority: P3)

**Goal**: Users can retrieve a specific trip request by ID or receive `TRIP_REQUEST_NOT_FOUND`.

**Independent Test**: Request a known ID and an unknown ID through `GET /trip-requests/{id}` and verify success and not-found envelopes.

### Tests for User Story 3

- [x] T040 [P] [US3] Add integration tests for `GET /trip-requests/{id}` success and `TRIP_REQUEST_NOT_FOUND` in tests/integration/trip-requests.routes.test.ts

### Implementation for User Story 3

- [x] T041 [US3] Implement repository find-by-id function in src/trip-requests/trip-requests.repository.ts
- [x] T042 [US3] Implement get-by-id service method with `TRIP_REQUEST_NOT_FOUND` mapping in src/trip-requests/trip-requests.service.ts
- [x] T043 [US3] Implement get-by-id controller action in src/trip-requests/trip-requests.controller.ts
- [x] T044 [US3] Register `GET /trip-requests/:id` route in src/trip-requests/trip-requests.routes.ts

**Checkpoint**: User Story 3 works independently after foundation and can be validated with any existing trip request.

---

## Phase 6: User Story 4 - Cancel a Trip Request (Priority: P4)

**Goal**: Users can cancel a pending trip request, receive not-found for unknown IDs, and receive `TRIP_REQUEST_ALREADY_CANCELED` for repeated cancellation.

**Independent Test**: Cancel an existing pending trip request, cancel an unknown ID, and cancel the same trip request again through `PATCH /trip-requests/{id}/cancel`.

### Tests for User Story 4

- [x] T045 [P] [US4] Add unit tests for cancel state transitions and already canceled behavior in tests/unit/trip-requests.service.test.ts
- [x] T046 [P] [US4] Add integration tests for `PATCH /trip-requests/{id}/cancel` success, not found, and already canceled in tests/integration/trip-requests.routes.test.ts

### Implementation for User Story 4

- [x] T047 [US4] Implement repository cancel update for pending trip requests in src/trip-requests/trip-requests.repository.ts
- [x] T048 [US4] Implement cancel service method with `TRIP_REQUEST_NOT_FOUND` and `TRIP_REQUEST_ALREADY_CANCELED` mapping in src/trip-requests/trip-requests.service.ts
- [x] T049 [US4] Implement cancel controller action in src/trip-requests/trip-requests.controller.ts
- [x] T050 [US4] Register `PATCH /trip-requests/:id/cancel` route in src/trip-requests/trip-requests.routes.ts

**Checkpoint**: User Story 4 completes the minimum trip request lifecycle.

---

## Phase 7: User Story 5 - List National Holidays by Year (Priority: P5)

**Goal**: Users can list national holidays for a year through BrasilAPI-backed data and receive `HOLIDAYS_API_UNAVAILABLE` when the external source cannot be reached.

**Independent Test**: Request `GET /holidays/{year}` with a stubbed BrasilAPI success response and a stubbed upstream failure.

### Tests for User Story 5

- [x] T051 [P] [US5] Add integration tests for `GET /holidays/{year}` success and invalid year in tests/integration/holidays.routes.test.ts
- [x] T052 [P] [US5] Add integration tests for `GET /holidays/{year}` upstream failure mapping to `HOLIDAYS_API_UNAVAILABLE` in tests/integration/holidays.routes.test.ts

### Implementation for User Story 5

- [x] T053 [US5] Implement holidays controller action for list-by-year in src/holidays/holidays.controller.ts
- [x] T054 [US5] Implement holidays routes with `GET /holidays/:year` in src/holidays/holidays.routes.ts
- [x] T055 [US5] Mount holidays routes in src/app.ts

**Checkpoint**: User Story 5 provides holiday transparency without preloading holiday data.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Finish delivery quality, documentation, verification, and assignment checklist items.

- [x] T056 [P] Update README with full team member names, package manager, chosen SGBD, setup, execution, tests, and endpoint examples in README.md
- [x] T057 [P] Add endpoint examples matching contracts/openapi.yaml in README.md
- [x] T058 [P] Verify `.env.example` values run locally without manual edits in .env.example
- [x] T059 [P] Verify `npm run init:db` is idempotent and does not seed holidays in src/db/init-db.ts
- [x] T060 Run full Vitest suite and fix any failures in tests/
- [x] T061 Run quickstart validation commands and update quickstart notes if needed in specs/001-trip-requests-api/quickstart.md
- [x] T062 Review all code identifiers, files, directories, comments, logs, tests, and error messages for English and naming convention compliance in src/ and tests/
- [x] T063 Verify all responses match the fixed success and error envelopes in src/middleware/response.ts and src/middleware/error-handler.ts
- [x] T064 Review Git history for multiple relevant English commits before public GitHub submission using .git/logs/HEAD

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion; blocks all user stories.
- **User Stories (Phase 3+)**: Depend on Foundational completion.
- **Polish (Phase 8)**: Depends on completed target stories.

### User Story Dependencies

- **User Story 1 (P1)**: MVP; can start after Foundational and has no dependency on other stories.
- **User Story 2 (P2)**: Can start after Foundational; uses shared repository/service files and seeded data.
- **User Story 3 (P3)**: Can start after Foundational; benefits from repository mapping from US1/US2.
- **User Story 4 (P4)**: Can start after Foundational; depends conceptually on existing trip request records.
- **User Story 5 (P5)**: Can start after Foundational; reuses the Holidays client/service from US1.

### Within Each User Story

- Tests come before implementation and should fail before the related implementation is complete.
- Types and repository functions come before service methods.
- Services come before controllers.
- Controllers come before route registration.
- Route registration comes before final integration validation.

---

## Parallel Opportunities

- Setup tasks T003-T007 can run in parallel.
- Foundational tasks T011-T017 and T020-T022 can run in parallel after project initialization.
- Test tasks within each user story can run in parallel when they target separate files or separate test cases.
- User Stories 2, 3, 4, and 5 can be developed in parallel after Foundational if the team coordinates edits to shared trip request files.
- README, `.env.example`, init-db verification, and naming review polish tasks can be split across team members.

## Parallel Example: User Story 1

```text
Task: "T023 [P] [US1] Add unit tests for date normalization and invalid date handling in tests/unit/date-time.test.ts"
Task: "T024 [P] [US1] Add unit tests for BrasilAPI success, normalization, and upstream failure behavior in tests/unit/holidays.service.test.ts"
Task: "T025 [P] [US1] Add unit tests for create validation rules and holiday blocking in tests/unit/trip-requests.service.test.ts"
Task: "T030 [P] [US1] Implement trip request repository create and row mapping functions in src/trip-requests/trip-requests.repository.ts"
```

## Parallel Example: User Story 5

```text
Task: "T051 [P] [US5] Add integration tests for GET /holidays/{year} success and invalid year in tests/integration/holidays.routes.test.ts"
Task: "T052 [P] [US5] Add integration tests for GET /holidays/{year} upstream failure mapping to HOLIDAYS_API_UNAVAILABLE in tests/integration/holidays.routes.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundation.
3. Complete Phase 3 User Story 1.
4. Stop and validate creation, date normalization, holiday blocking, upstream failure handling, persistence, and fixed envelopes.

### Incremental Delivery

1. Add User Story 1 for the core creation flow.
2. Add User Story 2 for list visibility.
3. Add User Story 3 for individual lookup and not-found handling.
4. Add User Story 4 for cancellation lifecycle.
5. Add User Story 5 for holiday listing transparency.
6. Finish Polish tasks and run the clean-clone delivery checklist.

### Parallel Team Strategy

1. Team completes Setup and Foundational together.
2. One developer owns trip request creation and business validation.
3. One developer owns listing/get-by-id/cancel repository and route work.
4. One developer owns BrasilAPI integration and holiday listing.
5. One developer owns Vitest coverage, README, and delivery checklist validation.

## Notes

- All task descriptions preserve assignment-required names such as `trip-requests`, `requesterName`, `departureAt`, `returnAt`, `passengerCount`, `DATABASE_URL`, and `HOLIDAYS_API_BASE_URL`.
- All code, comments, tests, logs, error messages, and commits should be in English.
- Do not preload or hardcode holidays; only seed trip requests in `init:db`.
- Commit after each task or coherent task group with clear English messages.
