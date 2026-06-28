import type { NextFunction, Request, Response } from 'express';
import {
  cancelTripRequestService,
  createTripRequestService,
  getTripRequestByIdService,
  listTripRequestsService,
} from './trip-requests.service.js';

export async function createTripRequestHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tripRequest = await createTripRequestService(req.body);
    res.success(201, tripRequest);
  } catch (error) {
    next(error);
  }
}

export async function listTripRequestsHandler(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tripRequests = await listTripRequestsService();
    res.success(200, tripRequests);
  } catch (error) {
    next(error);
  }
}

export async function getTripRequestByIdHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tripRequest = await getTripRequestByIdService(req.params.id);
    res.success(200, tripRequest);
  } catch (error) {
    next(error);
  }
}

export async function cancelTripRequestHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const tripRequest = await cancelTripRequestService(req.params.id);
    res.success(200, tripRequest);
  } catch (error) {
    next(error);
  }
}
