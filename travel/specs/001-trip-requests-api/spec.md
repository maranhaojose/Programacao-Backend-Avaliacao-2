# Feature Specification: Trip Requests API

**Feature Branch**: `001-trip-requests-api`

**Created**: 2026-06-26

**Status**: Draft

**Input**: User description: "Build a simplified REST API for institutional trip request management. The system only supports creating, listing, viewing by ID, and cancelling trip requests. Dates must be normalized and stored as ISO 8601 UTC with the Z suffix. When creating a trip, the system must check national holidays through BrasilAPI in real time or through on-demand mirroring. Trips departing on national holidays are blocked. If the external API is unavailable, the trip cannot be created and must return HTTP 502. All success and error responses have a fixed JSON contract. Error messages are in English and internal error codes use UPPER_SNAKE_CASE."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a Valid Trip Request (Priority: P1)

An institutional staff member submits a trip request with requester name, origin, destination, purpose, passenger count, departure date, and return date so the trip can be registered for review or operational tracking.

**Why this priority**: Creating trip requests is the primary value of the system and also contains the central business rule around date validation and holidays.

**Independent Test**: Can be fully tested by submitting a valid trip request for a non-holiday departure date and confirming that the response returns the fixed success contract with normalized UTC dates.

**Acceptance Scenarios**:

1. **Given** valid trip request data and a departure date that is not a national holiday, **When** the user submits the request, **Then** the system creates the trip request and returns the created record using the fixed success response contract.
2. **Given** a valid local date-time value in the request, **When** the trip request is accepted, **Then** the stored and returned date-time values are normalized to ISO 8601 UTC with a `Z` suffix.
3. **Given** a departure date that coincides with a national holiday, **When** the user submits the request, **Then** the system rejects the request and returns a fixed error response explaining that trips cannot depart on national holidays.
4. **Given** the holiday validation source is unavailable, **When** the user submits a trip request, **Then** the system rejects the request with HTTP 502 and the fixed error response contract.

---

### User Story 2 - List Trip Requests (Priority: P2)

An institutional staff member lists trip requests to see the registered travel demand and current cancellation status.

**Why this priority**: Listing gives users visibility into existing requests and makes the API useful beyond single create operations.

**Independent Test**: Can be fully tested by creating or seeding multiple trip requests and confirming that a list request returns them through the fixed success response contract.

**Acceptance Scenarios**:

1. **Given** existing trip requests, **When** the user asks for the trip request list, **Then** the system returns all available trip requests with normalized UTC dates and cancellation status.
2. **Given** no trip requests exist, **When** the user asks for the trip request list, **Then** the system returns an empty list using the fixed success response contract.

---

### User Story 3 - View a Trip Request by ID (Priority: P3)

An institutional staff member retrieves a single trip request by its identifier to inspect the request details.

**Why this priority**: Viewing by ID supports precise lookup and is necessary for workflows that reference one specific trip request.

**Independent Test**: Can be fully tested by requesting one known identifier and one unknown identifier and verifying the corresponding success and not-found responses.

**Acceptance Scenarios**:

1. **Given** an existing trip request, **When** the user requests it by ID, **Then** the system returns that trip request using the fixed success response contract.
2. **Given** an unknown trip request ID, **When** the user requests it by ID, **Then** the system returns a fixed not-found error response.

---

### User Story 4 - Cancel a Trip Request (Priority: P4)

An institutional staff member cancels a trip request that should no longer proceed.

**Why this priority**: Cancellation completes the minimum management lifecycle while keeping the product scope intentionally small.

**Independent Test**: Can be fully tested by cancelling an existing active trip request and confirming that later reads show it as cancelled.

**Acceptance Scenarios**:

1. **Given** an existing active trip request, **When** the user cancels it, **Then** the system marks it as cancelled and returns the updated trip request using the fixed success response contract.
2. **Given** an unknown trip request ID, **When** the user attempts cancellation, **Then** the system returns a fixed not-found error response.
3. **Given** an already canceled trip request, **When** the user attempts cancellation again, **Then** the system returns a fixed conflict error response explaining that the trip request is already canceled.

---

### User Story 5 - List National Holidays by Year (Priority: P5)

An institutional staff member lists national holidays for a given year to understand why some departure dates may be blocked.

**Why this priority**: Holiday listing supports transparency around the central validation rule while remaining secondary to trip request management.

**Independent Test**: Can be fully tested by requesting holidays for a valid year and confirming that the response returns normalized holiday data through the fixed success response contract.

**Acceptance Scenarios**:

1. **Given** a valid year, **When** the user asks for national holidays, **Then** the system returns the holiday list using the fixed success response contract.
2. **Given** holiday data cannot be retrieved for the year, **When** the user asks for national holidays, **Then** the system returns HTTP 502 using the fixed error response contract.

### Edge Cases

- The system rejects a trip request when `passengerCount` is zero, negative, missing, or not a whole number.
- The system rejects a trip request when `returnAt` is earlier than `departureAt`.
- The system rejects a trip request when any minimum required field is missing: `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, or `passengerCount`.
- The system rejects malformed, ambiguous, or unsupported date-time values.
- The system handles national holiday validation using the departure date after normalizing the submitted date-time.
- The system returns the fixed error contract for validation failures, missing records, holiday conflicts, and unavailable holiday validation.
- The system does not manage vehicles, drivers, fleet scheduling, or authentication.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to create trip requests with `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, and `passengerCount`.
- **FR-002**: System MUST allow users to list all trip requests.
- **FR-003**: System MUST allow users to retrieve a trip request by ID.
- **FR-004**: System MUST allow users to cancel a trip request by ID.
- **FR-005**: System MUST store and return every date-time value normalized as ISO 8601 UTC with the `Z` suffix.
- **FR-006**: System MUST reject trip creation when `passengerCount` is less than 1 or is not a whole number.
- **FR-007**: System MUST reject trip creation when `returnAt` is earlier than `departureAt`.
- **FR-008**: System MUST check whether the normalized departure date is a national holiday before creating a trip request.
- **FR-009**: System MUST reject trip creation when the departure date coincides with a national holiday.
- **FR-010**: System MUST reject trip creation with HTTP 502 when holiday validation cannot be completed because the external holiday source is unavailable.
- **FR-011**: System MUST NOT create or persist a trip request when holiday validation fails, the date is a national holiday, or input validation fails.
- **FR-012**: System MUST return every successful operation using a fixed JSON success contract.
- **FR-013**: System MUST return every failed operation using a fixed JSON error contract containing `success`, `error.code`, and `error.message`.
- **FR-014**: System MUST use English error messages and UPPER_SNAKE_CASE internal error codes.
- **FR-015**: System MUST return a not-found error when a requested trip request ID does not exist.
- **FR-016**: System MUST create every successful trip request with status `pending` and MUST change it to `canceled` when cancellation succeeds.
- **FR-017**: System MUST allow users to list national holidays by year using the fixed success response contract.
- **FR-018**: System MUST reject attempts to cancel an already canceled trip request with the `TRIP_REQUEST_ALREADY_CANCELED` error code.
- **FR-019**: System MUST preserve the exact technical names required by the assignment, including `trip-requests`, `requesterName`, `origin`, `destination`, `departureAt`, `returnAt`, `purpose`, `passengerCount`, `NODE_ENV`, `PORT`, `DATABASE_URL`, and `HOLIDAYS_API_BASE_URL`.
- **FR-020**: System MUST keep cancellation within the trip request lifecycle and MUST NOT introduce fleet, driver, frontend, or authentication management.
- **FR-021**: System MUST use at least the required internal error codes: `VALIDATION_ERROR`, `TRIP_REQUEST_NOT_FOUND`, `TRIP_REQUEST_ALREADY_CANCELED`, `HOLIDAY_TRIP_NOT_ALLOWED`, `HOLIDAYS_API_UNAVAILABLE`, and `INTERNAL_SERVER_ERROR`.
- **FR-022**: System MUST retrieve national holidays from `GET {HOLIDAYS_API_BASE_URL}/api/feriados/v1/{year}` when holiday data is needed.

### Key Entities

- **TripRequest**: Represents an institutional travel request. Key attributes include ID, requester name, origin, destination, departure date-time, return date-time, purpose, passenger count, status, and creation timestamp.
- **HolidayValidationResult**: Represents whether a departure date matches a national holiday or whether holiday validation could not be completed.
- **Holiday**: Represents a national holiday returned for a year. Key attributes include date, name, and type when available.
- **ErrorResponse**: Represents a failed operation using the fixed response contract with an internal code and English message.
- **SuccessResponse**: Represents a successful operation using the fixed response contract and the requested data.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can create a valid trip request in one submission when the departure date is not a national holiday.
- **SC-002**: 100% of accepted trip requests store and return date-time values as ISO 8601 UTC strings with a `Z` suffix.
- **SC-003**: 100% of trip creation attempts on national holidays are rejected before any trip request is created.
- **SC-004**: 100% of trip creation attempts are rejected with HTTP 502 when holiday validation is unavailable.
- **SC-005**: Users can list, view by ID, and cancel trip requests through the fixed response contract.
- **SC-006**: Users can list national holidays for a valid year through the fixed response contract.
- **SC-007**: 100% of error responses use English messages and UPPER_SNAKE_CASE internal error codes.

## Assumptions

- The primary users are institutional staff or systems that submit and inspect trip requests.
- Authentication, authorization, driver assignment, vehicle assignment, and fleet scheduling are outside the scope of this feature.
- Cancellation changes the trip request status rather than physically deleting the record.
- A repeated cancellation request for an already canceled trip request returns `TRIP_REQUEST_ALREADY_CANCELED`.
- Holiday validation applies only to Brazilian national holidays on the normalized departure date.
- The fixed success response contract includes a `success: true` indicator and a data payload.
- The fixed error response contract includes `success: false` and an `error` object with `code` and `message`.
- The implementation repository must include a README with team members, setup, execution, tests, package manager, chosen database, and endpoint documentation.
- The implementation repository must be public on GitHub, exclude `node_modules`, and show incremental commit history with clear English messages.
