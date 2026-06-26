# Data Model: Trip Requests API

## TripRequest

Represents an institutional travel request persisted in PostgreSQL.

### Fields

- `id`: Unique identifier for the trip request.
- `requesterName`: Required requester full name.
- `origin`: Required origin city.
- `destination`: Required destination city.
- `purpose`: Required trip purpose or justification.
- `passengerCount`: Required whole number of passengers.
- `departureAt`: Required departure date-time normalized to ISO 8601 UTC with `Z` in API responses.
- `returnAt`: Required return date-time normalized to ISO 8601 UTC with `Z` in API responses.
- `status`: Current lifecycle state.
- `createdAt`: Date-time when the record was created.

### Validation Rules

- `requesterName` must be present and non-empty.
- `origin` must be present and non-empty.
- `destination` must be present and non-empty.
- `purpose` must be present and non-empty.
- `passengerCount` must be a whole number greater than zero.
- `departureAt` must be a valid supported date-time input.
- `returnAt` must be a valid supported date-time input.
- `returnAt` must be greater than or equal to `departureAt`.
- `departureAt`, `returnAt`, and `createdAt` must be stored and returned as normalized UTC values.
- `departureAt` must not fall on a national holiday returned by holiday validation.

### States

- `pending`: Initial state for created trip requests.
- `canceled`: Final state after cancellation.

### State Transitions

```text
pending -> canceled
canceled -> TRIP_REQUEST_ALREADY_CANCELED
```

Repeated cancellation is rejected with a conflict error.

## Holiday

Represents a national holiday returned by the holiday integration.

### Fields

- `date`: Holiday calendar date.
- `name`: Holiday name.
- `type`: Holiday type when provided by the source.

### Validation Rules

- Holiday data is not preloaded or statically seeded.
- Holiday data is retrieved on demand for validation or list-by-year requests.
- If holiday retrieval fails, trip creation is blocked and the API returns an upstream dependency error.

## ResponseEnvelope

Represents the fixed API response shape.

### SuccessResponse

- `success`: Always `true`.
- `data`: Contains the requested resource, list, or operation result.

### ErrorResponse

- `success`: Always `false`.
- `error.code`: Internal UPPER_SNAKE_CASE error code.
- `error.message`: English explanatory message.

## Error Codes

- `VALIDATION_ERROR`: Invalid request body, invalid date, invalid passenger count, or invalid date range.
- `TRIP_REQUEST_NOT_FOUND`: Trip request ID does not exist.
- `TRIP_REQUEST_ALREADY_CANCELED`: Trip request is already canceled.
- `HOLIDAY_TRIP_NOT_ALLOWED`: Departure date coincides with a national holiday.
- `HOLIDAYS_API_UNAVAILABLE`: Holiday validation or holiday listing cannot be completed.
- `INTERNAL_SERVER_ERROR`: Unexpected unhandled failure.
