import { Router } from 'express';
import {
  cancelTripRequestHandler,
  createTripRequestHandler,
  getTripRequestByIdHandler,
  listTripRequestsHandler,
} from './trip-requests.controller.js';

export const tripRequestsRouter = Router();

tripRequestsRouter.post('/', createTripRequestHandler);
tripRequestsRouter.get('/', listTripRequestsHandler);
tripRequestsRouter.get('/:id', getTripRequestByIdHandler);
tripRequestsRouter.patch('/:id/cancel', cancelTripRequestHandler);
