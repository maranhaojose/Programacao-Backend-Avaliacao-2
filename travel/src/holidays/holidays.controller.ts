import type { NextFunction, Request, Response } from 'express';
import { listHolidaysByYear } from './holidays.service.js';

export async function listHolidaysByYearHandler(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const year = Number.parseInt(req.params.year, 10);
    const holidays = await listHolidaysByYear(year);
    res.success(200, holidays);
  } catch (error) {
    next(error);
  }
}
