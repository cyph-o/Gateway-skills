import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { buildConsents } from "./consents";
import { emptyShape, type Shape } from "./json-shape";
import { claimDue, hitBucket, markFailed, markSent, pruneBuckets } from "./json-outbox";
import type {
  CreateLeadResult,
  LeadListOptions,
  LeadRecord,
  LeadStore,
  NewLeadInput,
} from "./types";


/**
 * File-backed store. Writes go through a single in-process promise chain and
 * land via write-to-temp-then-rename, so a crash mid-write cannot leave a
 * half-written file that loses every lead captured so far.
 *
 * Suitable for local development and a single long-lived instance. It is NOT
 * suitable for serverless: see `describeDurability()` in ./index.ts.
 */
export class JsonLeadStore implements LeadStore {
  readonly driver = "json" as const;
  /** Serialises writes; concurrent submissions would otherwise clobber. */
  private queue: Promise<unknown> = Promise.resolve();

  constructor(private readonly file: string) {}

  private async read(): Promise<Shape> {
    try {
      const raw = await readFile(this.file, "utf8");
      const parsed = JSON.parse(raw) as Partial<Shape>;
      // Spread over a fresh shape so a file written by an earlier version,
      // before consents were stored, still loads.
      return { ...emptyShape(), ...parsed };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyShape();
      throw error;
    }
  }

  private async write(data: Shape): Promise<void> {
    await mkdir(dirname(this.file), { recursive: true });
    const temp = `${this.file}.${process.pid}.${Date.now()}.tmp`;
    await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
    // rename is atomic on POSIX: readers see either the old file or the new one.
    await rename(temp, this.file);
  }

  /** Runs `fn` with exclusive access to the file. */
  private transaction<T>(fn: (data: Shape) => Promise<T> | T): Promise<T> {
    const run = this.queue.then(async () => {
      const data = await this.read();
      const result = await fn(data);
      await this.write(data);
      return result;
    });
    // Keep the chain alive even if this operation rejects.
    this.queue = run.catch(() => undefined);
    return run;
  }

  async createLead(input: NewLeadInput): Promise<CreateLeadResult> {
    return this.transaction((data) => {
      const existing = data.leads.find((l) => l.submissionId === input.submissionId);
      if (existing) return { reference: existing.reference, duplicate: true };

      const lead: LeadRecord = {
        ...input,
        id: randomUUID(),
        status: "new",
        createdAt: new Date().toISOString(),
      };
      data.leads.push(lead);
      data.consents.push(...buildConsents(lead.id, lead.campaign, lead.marketingConsent));
      data.outbox.push({
        id: randomUUID(),
        leadId: lead.id,
        type: "lead_notification",
        state: "pending",
        attempts: 0,
        nextRetryAt: new Date().toISOString(),
        lastError: null,
        providerMessageId: null,
        createdAt: new Date().toISOString(),
        completedAt: null,
      });
      return { reference: lead.reference, duplicate: false };
    });
  }

  async listConsentsForLead(leadId: string) {
    const data = await this.read();
    return data.consents.filter((c) => c.leadId === leadId);
  }

  async listLeads(options: LeadListOptions = {}) {
    const data = await this.read();
    const { limit = 50, offset = 0, search, campaign } = options;
    const needle = search?.trim().toLowerCase();

    let rows = [...data.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (campaign) rows = rows.filter((l) => l.campaign === campaign);
    if (needle) {
      rows = rows.filter((l) =>
        [l.fullName, l.companyName, l.email, l.reference, l.jobTitle ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      );
    }
    return { leads: rows.slice(offset, offset + limit), total: rows.length };
  }

  async getLeadByReference(reference: string) {
    const data = await this.read();
    return data.leads.find((l) => l.reference === reference) ?? null;
  }

  async claimDueOutbox(limit: number) {
    return this.transaction((data) => claimDue(data, limit));
  }

  async markOutboxSent(id: string, providerMessageId?: string) {
    await this.transaction((data) => markSent(data, id, providerMessageId));
  }

  async markOutboxFailed(id: string, error: string, dead: boolean, nextRetryAt: Date) {
    await this.transaction((data) => markFailed(data, id, error, dead, nextRetryAt));
  }

  async listOutboxForLead(leadId: string) {
    const data = await this.read();
    return data.outbox.filter((e) => e.leadId === leadId);
  }

  async hitRateLimit(bucket: string, windowStart: Date) {
    return this.transaction((data) => hitBucket(data, bucket, windowStart));
  }

  async pruneRateLimits(before: Date) {
    await this.transaction((data) => pruneBuckets(data, before));
  }

  async ping() {
    await this.read();
  }
}

export function defaultJsonPath(): string {
  return process.env.LEAD_STORE_FILE ?? join(process.cwd(), ".data", "leads.json");
}
