<<<<<<< HEAD
export type TripRequestStatus = "pending" | "canceled";

export type TripRequest = {
=======
export type TripRequestStatus = 'pending' | 'canceled';

export interface TripRequest {
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  id: string;
  requesterName: string;
  origin: string;
  destination: string;
<<<<<<< HEAD
  departureAt: string;
  returnAt: string;
  purpose: string;
  passengerCount: number;
  status: TripRequestStatus;
  createdAt: string;
};

export type CreateTripRequestInput = {
  requesterName: string;
  origin: string;
  destination: string;
  departureAt: string;
  returnAt: string;
  purpose: string;
  passengerCount: number;
};

export type TripRequestRow = {
=======
  purpose: string;
  passengerCount: number;
  departureAt: string;
  returnAt: string;
  status: TripRequestStatus;
  createdAt: string;
}

export interface CreateTripRequestInput {
  requesterName: string;
  origin: string;
  destination: string;
  purpose: string;
  passengerCount: number;
  departureAt: string;
  returnAt: string;
}

export interface TripRequestRow {
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  id: string;
  requester_name: string;
  origin: string;
  destination: string;
<<<<<<< HEAD
  departure_at: Date;
  return_at: Date;
  purpose: string;
  passenger_count: number;
  status: TripRequestStatus;
  created_at: Date;
};
=======
  purpose: string;
  passenger_count: number;
  departure_at: Date;
  return_at: Date;
  status: TripRequestStatus;
  created_at: Date;
}
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
