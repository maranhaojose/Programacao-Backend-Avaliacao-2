import { env } from '../config/env.js';
import type { BrasilApiHolidayResponse } from './holidays.types.js';

export async function fetchHolidaysByYear(
  year: number,
  fetchFn: typeof fetch = fetch,
): Promise<BrasilApiHolidayResponse[]> {
  const url = `${env.HOLIDAYS_API_BASE_URL}/api/feriados/v1/${year}`;
  const response = await fetchFn(url);

  if (!response.ok) {
    throw new Error(`Holidays API returned status ${response.status}`);
  }

  const data = (await response.json()) as BrasilApiHolidayResponse[];
  return data;
}
