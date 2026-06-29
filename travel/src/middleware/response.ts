import type { NextFunction, Request, Response } from 'express';

export type SuccessResponseBody<T> = {
  success: true;
  data: T;
};

declare global {
  namespace Express {
    interface Response {
      success<T>(statusCode: number, data: T): Response;
    }
  }
}

export function successResponse<T>(data: T): SuccessResponseBody<T> {
  return {
    success: true,
    data,
  };
}

export function attachResponseHelpers(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.success = function success<T>(
    statusCode: number,
    data: T,
  ): Response {
    return this.status(statusCode).json(successResponse(data));
  };

  next();
}
