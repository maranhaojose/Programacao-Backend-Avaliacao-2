<<<<<<< HEAD
import express from "express";
import { holidaysRouter } from "./holidays/holidays.routes.js";
import { errorHandler } from "./middleware/error-handler.js";
import { responseMiddleware } from "./middleware/response.js";
import { tripRequestsRouter } from "./trip-requests/trip-requests.routes.js";

export function createApp(): express.Express {
  const app = express();

  app.use(express.json());
  app.use(responseMiddleware);
  app.use("/trip-requests", tripRequestsRouter);
  app.use("/holidays", holidaysRouter);
=======
import express from 'express';
import { attachResponseHelpers } from './middleware/response.js';
import { errorHandler } from './middleware/error-handler.js';
import { tripRequestsRouter } from './trip-requests/trip-requests.routes.js';
import { holidaysRouter } from './holidays/holidays.routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(attachResponseHelpers);
  app.use('/trip-requests', tripRequestsRouter);
  app.use('/holidays', holidaysRouter);
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  app.use(errorHandler);

  return app;
}
