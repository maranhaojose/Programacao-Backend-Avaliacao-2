<<<<<<< HEAD
import { Router } from "express";

export const holidaysRouter = Router();
=======
import { Router } from 'express';
import { listHolidaysByYearHandler } from './holidays.controller.js';

export const holidaysRouter = Router();

holidaysRouter.get('/:year', listHolidaysByYearHandler);
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
