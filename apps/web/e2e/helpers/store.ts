import { config } from "dotenv";
import { readFile, writeFile } from "node:fs/promises";
import { leadStore } from "../../src/lib/storage";
import { defaultJsonPath } from "../../src/lib/storage/json-store";
import type { ConsentRecord, LeadRecord, OutboxRecord } from "../../src/lib/storage/types";

config({ path: ".env.local", quiet: true });

/**
 * Test access to whichever driver the app is configured to use, so the suite
 * proves the behaviour of the storage that will actually run rather than of a
 * database the app may not be writing to. Reads go through the production
 * interface; only the cleanup paths, which no feature needs, are driver-aware.
 */

export type { ConsentRecord, LeadRecord, OutboxRecord };

export async function leadsByEmail(email: string): Promise<LeadRecord[]> {
  const needle = email.toLowerCase();
  // A high limit: the search filter is a convenience, the assertion is on the
  // exact normalised address.
  const { leads } = await leadStore().listLeads({ limit: 1000 });
  return leads
    .filter((l) => l.emailNormalised === needle)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function outboxForLead(leadId: string): Promise<OutboxRecord[]> {
  return leadStore().listOutboxForLead(leadId);
}

export function consentsForLead(leadId: string): Promise<ConsentRecord[]> {
  return leadStore().listConsentsForLead(leadId);
}

async function pgPool() {
  const { Pool } = await import("pg");
  return new Pool({ connectionString: process.env.DATABASE_URL });
}

export async function deleteLeadsByEmail(email: string): Promise<void> {
  const needle = email.toLowerCase();
  if (leadStore().driver === "postgres") {
    const pool = await pgPool();
    try {
      await pool.query("DELETE FROM leads WHERE email_normalised = $1", [needle]);
    } finally {
      await pool.end();
    }
    return;
  }
  await mutateJson((data) => {
    const doomed = new Set(
      data.leads.filter((l) => l.emailNormalised === needle).map((l) => l.id),
    );
    data.leads = data.leads.filter((l) => !doomed.has(l.id));
    data.consents = data.consents.filter((c) => !doomed.has(c.leadId));
    data.outbox = data.outbox.filter((e) => !doomed.has(e.leadId));
  });
}

export async function resetRateLimits(): Promise<void> {
  if (leadStore().driver === "postgres") {
    const pool = await pgPool();
    try {
      await pool.query("DELETE FROM rate_limit_counters");
    } finally {
      await pool.end();
    }
    return;
  }
  await mutateJson((data) => {
    data.rateLimits = [];
  });
}

interface JsonShape {
  leads: LeadRecord[];
  consents: ConsentRecord[];
  outbox: OutboxRecord[];
  rateLimits: unknown[];
}

/**
 * The server owns this file, so a test rewriting it races any in-flight
 * submission. Cleanup only ever runs between submissions, and a lost race
 * would leave a stray row rather than corrupt the file, because the write is
 * atomic (temp file + rename) on both sides.
 */
async function mutateJson(fn: (data: JsonShape) => void): Promise<void> {
  const file = defaultJsonPath();
  let data: JsonShape;
  try {
    data = JSON.parse(await readFile(file, "utf8")) as JsonShape;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  data.leads ??= [];
  data.consents ??= [];
  data.outbox ??= [];
  data.rateLimits ??= [];
  fn(data);
  const temp = `${file}.test-${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
  const { rename } = await import("node:fs/promises");
  await rename(temp, file);
}

/** Kept for symmetry with the old Postgres-only helper; pools are per-call. */
export async function closeDb(): Promise<void> {}
