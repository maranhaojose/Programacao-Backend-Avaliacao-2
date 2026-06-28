<<<<<<< HEAD
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
=======
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.example' });

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  HOLIDAYS_API_BASE_URL: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function parsePort(value: string): number {
  const port = Number.parseInt(value, 10);
  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${value}`);
  }
  return port;
}

export const env: EnvConfig = {
  NODE_ENV: requireEnv('NODE_ENV'),
  PORT: parsePort(requireEnv('PORT')),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  HOLIDAYS_API_BASE_URL: requireEnv('HOLIDAYS_API_BASE_URL'),
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
};
