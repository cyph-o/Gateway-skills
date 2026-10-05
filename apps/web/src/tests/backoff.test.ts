import { describe, expect, it } from "vitest";
import { isRetryableStatus, nextRetryDelay } from "@/lib/outbox/backoff";

describe("outbox backoff", () => {
  it("grows with each attempt and stays capped", () => {
    const first = nextRetryDelay(1);
    const later = nextRetryDelay(5);
    expect(first).toBeGreaterThan(0);
    expect(later).toBeGreaterThan(first);
    // Capped at one hour, so a stuck event is still retried regularly.
    expect(nextRetryDelay(50)).toBeLessThanOrEqual(60 * 60 * 1000);
  });

  it("jitters, so a backlog does not retry in lockstep after an outage", () => {
    const samples = new Set(Array.from({ length: 25 }, () => nextRetryDelay(4)));
    expect(samples.size).toBeGreaterThan(1);
  });

  it("treats rate limits and server errors as retryable, client errors as final", () => {
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(422)).toBe(false);
    // An unknown outcome must be retried: the send may have gone through.
    expect(isRetryableStatus(undefined)).toBe(true);
  });
});
