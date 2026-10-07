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
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!secret || !(await verifySessionToken(token, secret))) {
    redirect("/admin/login");
  }
}
