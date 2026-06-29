import dotenv from 'dotenv';
import { AppError } from '../errors/app-error.js';
import { ErrorCodes } from '../errors/error-codes.js';

dotenv.config();

type Env = {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  HOLIDAYS_API_BASE_URL: string;
};

function readRequiredString(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === '') {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, `${name} is required.`);
  }

  return value.trim();
}

function readPort(): number {
  const rawPort = readRequiredString('PORT');
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new AppError(ErrorCodes.VALIDATION_ERROR, 'PORT must be a valid TCP port.');
  }

  return port;
}

function readBaseUrl(): string {
  const value = readRequiredString('HOLIDAYS_API_BASE_URL');

  try {
    new URL(value);
  } catch {
    throw new AppError(
      ErrorCodes.VALIDATION_ERROR,
      'HOLIDAYS_API_BASE_URL must be a valid URL.',
    );
  }

  return value.replace(/\/+$/, '');
}

export const env: Env = {
  NODE_ENV: readRequiredString('NODE_ENV'),
  PORT: readPort(),
  DATABASE_URL: readRequiredString('DATABASE_URL'),
  HOLIDAYS_API_BASE_URL: readBaseUrl(),
};
