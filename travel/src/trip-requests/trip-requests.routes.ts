<<<<<<< HEAD
import { Router } from "express";

export const tripRequestsRouter = Router();
=======
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
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
