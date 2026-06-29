import { vi } from 'vitest';
import type { BrasilApiHolidayResponse } from '../../src/holidays/holidays.types.js';

export const DEFAULT_HOLIDAYS: BrasilApiHolidayResponse[] = [
  {
    date: '2026-01-01',
    name: 'Universal Fraternization Day',
    type: 'national',
  },
  {
    date: '2026-04-21',
    name: 'Tiradentes Day',
    type: 'national',
  },
  {
    date: '2026-09-07',
    name: 'Independence Day',
    type: 'national',
  },
  {
    date: '2026-12-25',
    name: 'Christmas Day',
    type: 'national',
  },
];

type BrasilApiFetchStubOptions = {
  holidays?: BrasilApiHolidayResponse[];
  fail?: boolean;
};

export function createBrasilApiFetchStub(
  options: BrasilApiFetchStubOptions = {},
): typeof fetch {
  return vi.fn(async () => {
    if (options.fail) {
      return new Response('Service unavailable', { status: 503 });
    }

    return new Response(JSON.stringify(options.holidays ?? DEFAULT_HOLIDAYS), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  }) as unknown as typeof fetch;
}

export function stubGlobalFetch(options: BrasilApiFetchStubOptions = {}): () => void {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createBrasilApiFetchStub(options);

  return () => {
    globalThis.fetch = originalFetch;
  };
}
