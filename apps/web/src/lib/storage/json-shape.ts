import type { ConsentRecord, LeadRecord, OutboxRecord } from "./types";

/** Everything the file holds. One document, rewritten atomically. */
export interface Shape {
  leads: LeadRecord[];
  consents: ConsentRecord[];
  outbox: OutboxRecord[];
  rateLimits: { bucket: string; windowStart: string; count: number }[];
}

/** A factory, not a shared constant: spreading one object would hand every
 *  caller the same array instances, so the first write to a not-yet-created
 *  file would mutate the template and leak those records into later reads. */
export function emptyShape(): Shape {
  return { leads: [], consents: [], outbox: [], rateLimits: [] };
}
