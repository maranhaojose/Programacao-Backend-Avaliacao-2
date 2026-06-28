<<<<<<< HEAD
import { vi } from "vitest";
import type { BrasilApiHolidayResponse } from "../../src/holidays/holidays.types.js";

export function stubBrasilApiSuccess(holidays: BrasilApiHolidayResponse[]): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      return new Response(JSON.stringify(holidays), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }),
  );
}

export function stubBrasilApiFailure(status = 503): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      return new Response("Service unavailable", { status });
    }),
  );
}

export function restoreBrasilApiStub(): void {
  vi.unstubAllGlobals();
=======
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

export interface StubFetchOptions {
  holidays?: BrasilApiHolidayResponse[];
  fail?: boolean;
  statusCode?: number;
}

export function createBrasilApiFetchStub(options: StubFetchOptions = {}) {
  const holidays = options.holidays ?? DEFAULT_HOLIDAYS;
  const fail = options.fail ?? false;
  const statusCode = options.statusCode ?? 500;

  return async (input: RequestInfo | URL, _init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString();

    if (!url.includes('/api/feriados/v1/')) {
      return new Response('Not Found', { status: 404 });
    }

    if (fail) {
      return new Response('Service Unavailable', { status: statusCode });
    }

    return new Response(JSON.stringify(holidays), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };
}

export function stubGlobalFetch(options: StubFetchOptions = {}): () => void {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = createBrasilApiFetchStub(options) as typeof fetch;

  return () => {
    globalThis.fetch = originalFetch;
  };
>>>>>>> f6b3d79 (feat(api): implement foundational setup, core trip features, and finalize documentation (T008-T064))
}
