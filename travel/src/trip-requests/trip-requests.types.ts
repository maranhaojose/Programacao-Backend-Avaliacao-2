export type TripRequestStatus = 'pending' | 'canceled';

export type TripRequest = {
  id: string;
  requesterName: string;
  origin: string;
  destination: string;
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
  id: string;
  requester_name: string;
  origin: string;
  destination: string;
  departure_at: Date;
  return_at: Date;
  purpose: string;
  passenger_count: number;
  status: TripRequestStatus;
  created_at: Date;
};
