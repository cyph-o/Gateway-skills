/**
 * Storage contract for leads and their notification outbox.
 *
 * Two drivers implement it: a JSON file (the default, good for local work and
 * small single-instance deployments) and Postgres. Keeping the capture path
 * behind this interface means the durability rules — commit before
 * acknowledging, idempotent on submission id, outbox written with the lead —
 * are stated once and honoured by both.
 */

export interface LeadRecord {
  id: string;
  reference: string;
  submissionId: string;
  fullName: string;
  jobTitle: string | null;
  companyName: string;
  mobileNumber: string;
  email: string;
  emailNormalised: string;
  campaign: string;
  employeeBand: string | null;
  levyPayer: string | null;
  interests: string[];
  attribution: Record<string, string>;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  marketingConsent: boolean;
}

export interface ConsentRecord {
  leadId: string;
  purpose: "enquiry_response" | "marketing";
  granted: boolean;
  /** Which version of the privacy notice was shown when this was given. */
  noticeVersion: string;
  /** Where it was captured, so a claim can be traced to a page. */
  source: string;
  createdAt: string;
}

export type OutboxState = "pending" | "processing" | "sent" | "failed" | "dead_letter";

export interface OutboxRecord {
  id: string;
  leadId: string;
  type: "lead_notification";
  state: OutboxState;
  attempts: number;
  nextRetryAt: string;
  lastError: string | null;
  providerMessageId: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface NewLeadInput {
  submissionId: string;
  reference: string;
  fullName: string;
  jobTitle: string | null;
  companyName: string;
  mobileNumber: string;
  email: string;
  emailNormalised: string;
  campaign: string;
  employeeBand: string | null;
  levyPayer: string | null;
  interests: string[];
  attribution: Record<string, string>;
  marketingConsent: boolean;
}

export interface CreateLeadResult {
  reference: string;
  /** True when this submission id has already been accepted. */
  duplicate: boolean;
}

export interface LeadListOptions {
  limit?: number;
  offset?: number;
  search?: string;
  campaign?: string;
}

export interface LeadStore {
  readonly driver: "json" | "postgres";

  /** Writes the lead and its notification outbox entry together. Idempotent
   *  on submissionId: a repeat returns the original reference and enqueues
   *  nothing further. */
  createLead(input: NewLeadInput): Promise<CreateLeadResult>;

  /** The consent pair recorded with the lead, for subject-access requests and
   *  for proving what someone was told before they agreed. */
  listConsentsForLead(leadId: string): Promise<ConsentRecord[]>;

  listLeads(options?: LeadListOptions): Promise<{ leads: LeadRecord[]; total: number }>;
  getLeadByReference(reference: string): Promise<LeadRecord | null>;

  /** Claims due outbox entries and marks them processing, so concurrent
   *  drains cannot pick up the same one. */
  claimDueOutbox(limit: number): Promise<OutboxRecord[]>;
  markOutboxSent(id: string, providerMessageId?: string): Promise<void>;
  markOutboxFailed(id: string, error: string, dead: boolean, nextRetryAt: Date): Promise<void>;
  listOutboxForLead(leadId: string): Promise<OutboxRecord[]>;

  /** Fixed-window counter. Returns the count after incrementing. */
  hitRateLimit(bucket: string, windowStart: Date): Promise<number>;
  pruneRateLimits(before: Date): Promise<void>;

  /** Cheap check used by the health endpoint. */
  ping(): Promise<void>;
}
