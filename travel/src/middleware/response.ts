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

  next();
}
