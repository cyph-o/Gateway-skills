import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/session";

/**
 * Guards the admin area. In Next 16 this file is `proxy.ts` — `middleware.ts`
 * is deprecated and renamed.
 *
 * Only the session signature is checked here, never the password and never the
 * database: proxy runs before rendering and may be deployed to the edge, so it
 * deliberately holds no shared state.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay reachable, or there is no way back in.
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Unconfigured means closed, not open.
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("error", "unconfigured");
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (await verifySessionToken(token, secret)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  // Send them back where they were headed once signed in.
  if (pathname !== "/admin") url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/admin/:path*",
};
