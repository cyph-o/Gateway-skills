import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { CAMPAIGNS } from "@/lib/leads/campaigns";
import { PROGRAMME_INTERESTS } from "@/lib/leads/schema";
import { requireAdmin } from "@/lib/admin/guard";
import { leadStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" });

const STATE_TONE: Record<string, string> = {
  sent: "text-emerald",
  pending: "text-ink-muted",
  processing: "text-ink-muted",
  failed: "text-amber-700",
  dead_letter: "text-red-700",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  await requireAdmin();

  const { reference } = await params;
  const store = leadStore();
  const lead = await store.getLeadByReference(reference);
  if (!lead) notFound();

  const outbox = await store.listOutboxForLead(lead.id);
  const campaign = (CAMPAIGNS as Record<string, { label: string }>)[lead.campaign];

  const rows: [string, string][] = [
    ["Received", dateFormat.format(new Date(lead.createdAt))],
    ["Full name", lead.fullName],
    ["Job title", lead.jobTitle || "Not given"],
    ["Organisation", lead.companyName],
    ["Email", lead.email],
    ["Phone", lead.mobileNumber],
    ["UK employees", lead.employeeBand || "Not given"],
    ["Pays the levy", lead.levyPayer || "Not given"],
    [
      "Programmes of interest",
      lead.interests.length
        ? lead.interests
            .map((k) => (PROGRAMME_INTERESTS as Record<string, string>)[k] ?? k)
            .join(", ")
        : "None ticked",
    ],
    ["Programme enquired about", campaign?.label ?? lead.campaign],
    ["Marketing consent", lead.marketingConsent ? "Given" : "Not given"],
    [
      "Attribution",
      Object.entries(lead.attribution)
        .map(([k, v]) => `${k}=${v}`)
        .join(" · ") || "Direct",
    ],
  ];

  return (
    <Container width="text" className="py-12">
      <Link href="/admin" className="text-sm text-emerald underline underline-offset-2">
        ← All enquiries
      </Link>

      <Eyebrow className="mt-8">{lead.reference}</Eyebrow>
      <h1 className="mt-4 text-display-sm">{lead.companyName}</h1>

      <dl className="mt-10 divide-y divide-line border-y border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <dt className="text-sm font-medium text-ink-strong">{label}</dt>
            <dd className="leading-relaxed break-words text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-xl">Notification</h2>
      {outbox.length === 0 ? (
        <p className="mt-3 text-ink-muted">No notification queued.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {outbox.map((entry) => (
            <li key={entry.id} className="rounded-md border border-line bg-surface p-4 text-sm">
              <p className={`font-semibold ${STATE_TONE[entry.state] ?? "text-ink"}`}>
                {entry.state.replace("_", " ")} · attempt {entry.attempts}
              </p>
              {entry.lastError ? (
                <p className="mt-2 break-words text-ink-muted">{entry.lastError}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
