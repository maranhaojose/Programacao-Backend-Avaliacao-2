import dotenv from "dotenv";
import { AppError } from "../errors/app-error.js";
import { ERROR_CODES } from "../errors/error-codes.js";

dotenv.config();

export type AppEnv = {
  nodeEnv: string;
  port: number;
  databaseUrl: string;
  holidaysApiBaseUrl: string;
};

function requireString(name: string): string {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, `${name} is required.`);
  }

  return value.trim();
}

function requirePort(name: string): number {
  const rawValue = requireString(name);
  const port = Number(rawValue);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, `${name} must be a valid TCP port.`);
  }

  return port;
}

function requireUrl(name: string): string {
  const value = requireString(name);

  try {
    new URL(value);
  } catch {
    throw new AppError(ERROR_CODES.VALIDATION_ERROR, `${name} must be a valid URL.`);
  }

  return value.replace(/\/+$/, "");
}

export const env: AppEnv = {
  nodeEnv: requireString("NODE_ENV"),
  port: requirePort("PORT"),
  databaseUrl: requireString("DATABASE_URL"),
  holidaysApiBaseUrl: requireUrl("HOLIDAYS_API_BASE_URL"),
};
