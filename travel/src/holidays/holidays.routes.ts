import { Router } from 'express';
import { listHolidaysByYearHandler } from './holidays.controller.js';

export const holidaysRouter = Router();

holidaysRouter.get('/:year', listHolidaysByYearHandler);
