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
  app.use(errorHandler);

  return app;
}
