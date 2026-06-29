import express from 'express';
import { holidaysRouter } from './holidays/holidays.routes.js';
import { attachResponseHelpers } from './middleware/response.js';
import { errorHandler } from './middleware/error-handler.js';
import { tripRequestsRouter } from './trip-requests/trip-requests.routes.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(attachResponseHelpers);
  app.use('/trip-requests', tripRequestsRouter);
  app.use('/holidays', holidaysRouter);
  app.use(errorHandler);

  return app;
}
