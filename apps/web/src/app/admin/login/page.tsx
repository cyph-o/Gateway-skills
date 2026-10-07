"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { signIn } from "@/actions/admin-auth";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { initialAdminLoginState } from "@/lib/admin/login-state";

function LoginForm() {
  const [state, action] = useActionState(signIn, initialAdminLoginState);
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const unconfigured = params.get("error") === "unconfigured";

  return (
    <form action={action} className="mt-8 max-w-sm">
      <input type="hidden" name="next" value={next} />

      {state.error ? (
        <p
          role="alert"
          className="mb-5 rounded-sm border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900"
        >
          {state.error}
        </p>
      ) : null}

      {unconfigured && !state.error ? (
        <p className="mb-5 rounded-sm border border-line-strong bg-surface px-4 py-3 text-sm text-ink-muted">
          Admin access is not configured on this deployment. Set
          <code className="mx-1">ADMIN_PASSWORD_HASH</code> and
          <code className="mx-1">ADMIN_SESSION_SECRET</code>.
        </p>
      ) : null}

      <label htmlFor="password" className="block text-sm font-medium text-ink-strong">
        Admin password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-2 block min-h-12 w-full rounded-sm border border-line-strong bg-surface px-3.5 text-base text-ink-strong focus:border-emerald"
      />

      <Button type="submit" size="lg" className="mt-6 w-full">
        Sign in
      </Button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Container width="text" className="py-20">
      <Eyebrow>Gateway Skills Network</Eyebrow>
      <h1 className="mt-5 text-display-sm">Admin sign in</h1>
      <p className="mt-4 leading-relaxed text-ink-muted">
        This area contains enquiry records, including personal contact details.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </Container>
  );
}
