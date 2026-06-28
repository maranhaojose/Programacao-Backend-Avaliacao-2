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
}
