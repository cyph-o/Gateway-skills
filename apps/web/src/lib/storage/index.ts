import { JsonLeadStore, defaultJsonPath } from "./json-store";
import { PostgresLeadStore } from "./postgres-store";
import type { LeadStore } from "./types";

export type { LeadRecord, LeadStore, OutboxRecord } from "./types";

/**
 * Driver selection.
 *
 * JSON is the default: it needs no services and makes local work and small
 * self-hosted deployments trivial. `LEAD_STORAGE=postgres` (or simply setting
 * DATABASE_URL and LEAD_STORAGE=postgres) switches to Postgres.
 *
 * READ THIS BEFORE DEPLOYING SERVERLESS. A serverless filesystem is ephemeral
 * and per-instance: on Vercel the JSON file is written to a container that is
 * discarded, and a second concurrent request may not even see the same file.
 * Leads captured that way are lost once the instance recycles. The check below
 * makes that loud rather than silent.
 */
const globalForStore = globalThis as unknown as { __gsnStore?: LeadStore };

function selectDriver(): "json" | "postgres" {
  const explicit = process.env.LEAD_STORAGE?.toLowerCase();
  if (explicit === "postgres" || explicit === "json") return explicit;
  return "json";
}

export function isServerlessRuntime(): boolean {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export interface DurabilityWarning {
  severity: "critical" | "ok";
  message: string;
}

/** Surfaced by /api/health and the admin dashboard, so the risk is visible
 *  somewhere a human actually looks rather than buried in a log line. */
export function describeDurability(): DurabilityWarning {
  const driver = selectDriver();
  if (driver === "json" && isServerlessRuntime()) {
    return {
      severity: "critical",
      message:
        "JSON file storage is active on a serverless host. The filesystem is " +
        "ephemeral and per-instance, so captured leads WILL be lost when the " +
        "instance recycles. Set LEAD_STORAGE=postgres and DATABASE_URL.",
    };
  }
  if (driver === "json") {
    return {
      severity: "ok",
      message: `JSON file storage at ${defaultJsonPath()}. Suitable for local use and a single persistent instance.`,
    };
  }
  return { severity: "ok", message: "Postgres storage." };
}

export function leadStore(): LeadStore {
  if (!globalForStore.__gsnStore) {
    const driver = selectDriver();
    globalForStore.__gsnStore =
      driver === "postgres" ? new PostgresLeadStore() : new JsonLeadStore(defaultJsonPath());

    const durability = describeDurability();
    if (durability.severity === "critical") {
      console.error(
        JSON.stringify({ level: "error", event: "storage.unsafe", message: durability.message }),
      );
    }
  }
  return globalForStore.__gsnStore;
}
