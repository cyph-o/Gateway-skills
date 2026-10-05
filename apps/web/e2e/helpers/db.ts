import { config } from "dotenv";
import { Pool } from "pg";

config({ path: ".env.local", quiet: true });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export interface LeadRow {
  id: string;
  reference: string;
  submission_id: string;
  full_name: string;
  company_name: string;
  mobile_number: string;
  email: string;
  campaign: string;
  attribution: Record<string, string>;
}

export async function leadsByEmail(email: string): Promise<LeadRow[]> {
  const { rows } = await pool.query<LeadRow>(
    "SELECT * FROM leads WHERE email_normalised = $1 ORDER BY created_at",
    [email.toLowerCase()],
  );
  return rows;
}

export async function outboxForLead(leadId: string) {
  const { rows } = await pool.query<{ id: string; state: string; attempts: number; type: string }>(
    "SELECT id, state, attempts, type FROM outbox_events WHERE lead_id = $1",
    [leadId],
  );
  return rows;
}

export async function consentsForLead(leadId: string) {
  const { rows } = await pool.query<{ purpose: string; granted: boolean; notice_version: string }>(
    "SELECT purpose, granted, notice_version FROM lead_consents WHERE lead_id = $1",
    [leadId],
  );
  return rows;
}

export async function deleteLeadsByEmail(email: string): Promise<void> {
  await pool.query("DELETE FROM leads WHERE email_normalised = $1", [email.toLowerCase()]);
}

export async function resetRateLimits(): Promise<void> {
  await pool.query("DELETE FROM rate_limit_counters");
}

export async function closeDb(): Promise<void> {
  await pool.end();
}
