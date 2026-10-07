import Link from "next/link";
import { CAMPAIGNS } from "@/lib/leads/campaigns";
import type { LeadRecord } from "@/lib/storage";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function campaignLabel(id: string): string {
  return (CAMPAIGNS as Record<string, { label: string }>)[id]?.label ?? id;
}

/** Enquiry list. Horizontally scrollable on small screens rather than crushed:
 *  a phone number wrapped mid-digit is worse than a scrollbar. */
export function LeadTable({ leads }: { leads: readonly LeadRecord[] }) {
  if (leads.length === 0) {
    return (
      <p className="mt-10 rounded-md border border-line bg-surface p-8 text-center text-ink-muted">
        No enquiries yet.
      </p>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto rounded-md border border-line bg-surface">
      <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line bg-ground">
            {["Received", "Reference", "Name", "Organisation", "Contact", "Programme"].map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold text-ink-strong">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-line last:border-0 hover:bg-ground/70">
              <td className="px-4 py-3 whitespace-nowrap text-ink-muted">
                {formatter.format(new Date(lead.createdAt))}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Link
                  href={`/admin/leads/${lead.reference}`}
                  className="font-mono text-emerald underline underline-offset-2"
                >
                  {lead.reference}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span className="block font-medium text-ink-strong">{lead.fullName}</span>
                {lead.jobTitle ? (
                  <span className="block text-xs text-ink-muted">{lead.jobTitle}</span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-ink">{lead.companyName}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                <a
                  href={`mailto:${lead.email}`}
                  className="block text-emerald underline underline-offset-2"
                >
                  {lead.email}
                </a>
                <a href={`tel:${lead.mobileNumber}`} className="block text-xs text-ink-muted">
                  {lead.mobileNumber}
                </a>
              </td>
              <td className="px-4 py-3 text-xs text-ink-muted">{campaignLabel(lead.campaign)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
