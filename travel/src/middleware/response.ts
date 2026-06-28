<<<<<<< HEAD
import type { NextFunction, Request, Response } from "express";

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

declare module "express-serve-static-core" {
  interface Response {
    success<T>(data: T, statusCode?: number): Response<SuccessResponse<T>>;
  }
}

export function buildSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

export function responseMiddleware(_request: Request, response: Response, next: NextFunction): void {
  response.success = function success<T>(data: T, statusCode = 200): Response<SuccessResponse<T>> {
    return this.status(statusCode).json(buildSuccessResponse(data));
  };

=======
import type { Response } from 'express';

export interface SuccessResponse<T> {
  success: true;
  data: T;
}

export function sendSuccess<T>(res: Response, statusCode: number, data: T): Response {
  const body: SuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(body);
}

declare global {
  namespace Express {
    interface Response {
      success: <T>(statusCode: number, data: T) => Response;
    }
  }
}

export function attachResponseHelpers(
  _req: unknown,
  res: Response,
  next: () => void,
): void {
  res.success = <T>(statusCode: number, data: T) => sendSuccess(res, statusCode, data);
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
  next();
}
