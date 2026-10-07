import Link from "next/link";
import { signOut } from "@/actions/admin-auth";
import { Container } from "@/components/layout/Container";

/**
 * Admin chrome, shown on every admin page once signed in.
 *
 * Sign-out belongs here rather than on the dashboard alone: someone reading a
 * record is looking at a named person's contact details, and ending the session
 * must not require navigating back first.
 */
export function AdminBar() {
  return (
    <div className="border-b border-line bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-3 py-3">
        <Link
          href="/admin"
          className="font-mono text-xs tracking-[0.12em] uppercase text-ink-muted hover:text-ink-strong"
        >
          Gateway Skills · Enquiries
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-md border border-line px-4 py-2 text-sm font-semibold text-ink-strong transition hover:border-line-strong hover:bg-ground"
          >
            Sign out
          </button>
        </form>
      </Container>
    </div>
  );
}
