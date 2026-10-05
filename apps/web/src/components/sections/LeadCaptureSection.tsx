import { Container } from "@/components/layout/Container";
import { LeadForm } from "@/components/forms/LeadForm";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Icon } from "@/components/primitives/Icon";
import type { Attribution } from "@/lib/attribution";
import type { CampaignId } from "@/lib/leads/campaigns";

interface LeadCaptureSectionProps {
  id?: string;
  index: string;
  heading: string;
  standfirst: string;
  submitLabel: string;
  campaign: CampaignId;
  attribution?: Attribution;
  assurances?: readonly string[];
}

const DEFAULT_ASSURANCES = [
  "No obligation — the audit establishes what you qualify for",
  "Your details are used to respond to this enquiry",
  "A senior adviser replies directly, not an automated sequence",
] as const;

/**
 * The conversion engine. Form on the right of a forest panel so it reads as
 * the page's single destination; copy on the left carries the reassurance that
 * makes a stranger at a trade stand willing to hand over a mobile number.
 */
export function LeadCaptureSection({
  id = "register",
  index,
  heading,
  standfirst,
  submitLabel,
  campaign,
  attribution,
  assurances = DEFAULT_ASSURANCES,
}: LeadCaptureSectionProps) {
  return (
    <section id={id} data-surface="forest" className="scroll-mt-20 bg-forest py-20 md:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,27rem)] lg:gap-20">
          <div>
            <Eyebrow className="text-emerald-lift">{index}</Eyebrow>
            <h2 className="mt-5 text-display-md">{heading}</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-on-forest-muted">
              {standfirst}
            </p>
            <ul className="mt-9 space-y-4">
              {assurances.map((item) => (
                <li key={item} className="flex gap-3 text-on-forest-muted">
                  <Icon name="badge-check" className="h-5 w-5 shrink-0 text-emerald-lift" />
                  <span className="text-[0.9375rem] leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* A light island inside a forest section: data-surface resets the
              inherited dark-surface text colours for everything within. */}
          <div data-surface="light" className="rounded-sm bg-surface p-6 md:p-8">
            <LeadForm campaign={campaign} submitLabel={submitLabel} attribution={attribution} />
          </div>
        </div>
      </Container>
    </section>
  );
}
