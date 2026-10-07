import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifySessionToken } from "./session";

/**
 * Server-side re-check for admin pages and actions.
 *
 * The proxy already blocks unauthenticated requests, but this is checked again
 * at the point the data is actually read. Defence that lives only in a routing
 * layer is one misconfigured matcher away from exposing every lead's personal
 * details.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await hasAdminSession())) redirect("/admin/login");
}

/** The same check without the redirect, for chrome that should only appear to
 *  someone already signed in. */
export async function hasAdminSession(): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  return Boolean(secret) && (await verifySessionToken(token, secret!));
}
