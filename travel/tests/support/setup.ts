import dotenv from 'dotenv';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.example' });

process.env.NODE_ENV ??= 'test';
process.env.PORT ??= '3000';
process.env.DATABASE_URL ??=
  'postgres://trip_user:trip_password@localhost:5432/trip_requests';
process.env.HOLIDAYS_API_BASE_URL ??= 'https://brasilapi.test';
