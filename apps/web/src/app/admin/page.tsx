import Link from "next/link";
import { signOut } from "@/actions/admin-auth";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { LeadTable } from "@/components/admin/LeadTable";
import { requireAdmin } from "@/lib/admin/guard";
import { describeDurability, leadStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requireAdmin();

  const { q, page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const store = leadStore();
  const { leads, total } = await store.listLeads({
    search: q,
    limit: PAGE_SIZE,
    offset: (current - 1) * PAGE_SIZE,
  });
  const durability = describeDurability();
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Container className="py-12">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <Eyebrow>Gateway Skills Network</Eyebrow>
          <h1 className="mt-4 text-display-sm">Enquiries</h1>
          <p className="mt-2 text-ink-muted">
            {total} {total === 1 ? "enquiry" : "enquiries"} · storage: {store.driver}
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </div>

      {durability.severity === "critical" ? (
        <p
          role="alert"
          className="mt-8 rounded-md border border-red-300 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-900"
        >
          <strong className="block">Enquiries are not being stored durably.</strong>
          {durability.message}
        </p>
      ) : null}

      <form className="mt-8 flex flex-wrap gap-3" action="/admin">
        <input
          type="search"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search name, organisation, email or reference"
          aria-label="Search enquiries"
          className="min-h-11 flex-1 rounded-sm border border-line-strong bg-surface px-3.5 text-base text-ink-strong"
        />
        <Button type="submit">Search</Button>
        {q ? (
          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center px-3 text-sm text-emerald underline underline-offset-2"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <LeadTable leads={leads} />

      {pages > 1 ? (
        <nav className="mt-8 flex items-center gap-4" aria-label="Pagination">
          {current > 1 ? (
            <Link href={`/admin?page=${current - 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Previous
            </Link>
          ) : null}
          <span className="text-sm text-ink-muted">
            Page {current} of {pages}
          </span>
          {current < pages ? (
            <Link href={`/admin?page=${current + 1}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>
              Next
            </Link>
          ) : null}
        </nav>
      ) : null}
    </Container>
  );
}
