"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, SESSION_TTL_SECONDS, createSessionToken } from "@/lib/admin/session";
import { verifyPassword } from "@/lib/admin/auth";
import { checkAdminRateLimit } from "@/lib/leads/rate-limit";
import { logger } from "@/lib/logger";
import type { AdminLoginState } from "@/lib/admin/login-state";

/**
 * Sign-in. Rate limited on its own counters (never the public form's), so a
 * brute-force attempt is throttled rather than merely slow, and the failure
 * message never distinguishes "wrong password" from "not configured" — that
 * distinction is only useful to an attacker.
 */
export async function signIn(
  _prev: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const password = formData.get("password");
  const next = formData.get("next");
  const target = typeof next === "string" && next.startsWith("/admin") ? next : "/admin";

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const limit = await checkAdminRateLimit(ip);
  if (!limit.allowed) {
    logger.warn("admin.login_rate_limited", {});
    return { error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!hash || !secret || typeof password !== "string" || password.length === 0) {
    logger.warn("admin.login_failed", { reason: !hash || !secret ? "unconfigured" : "empty" });
    return { error: "Sign in failed. Check your password and try again." };
  }

  if (!(await verifyPassword(password, hash))) {
    logger.warn("admin.login_failed", { reason: "bad_password" });
    return { error: "Sign in failed. Check your password and try again." };
  }

  // Secure is decided by the actual request protocol, not NODE_ENV: a
  // production build served over plain HTTP (localhost, a preview box) would
  // otherwise set a Secure cookie that the browser silently discards, making
  // sign-in appear to fail for no visible reason.
  const forwardedProto = headerList.get("x-forwarded-proto");
  const isHttps = forwardedProto
    ? forwardedProto.split(",")[0]?.trim() === "https"
    : (headerList.get("host") ?? "").startsWith("localhost") === false;

  (await cookies()).set(ADMIN_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  logger.info("admin.login_success", {});
  redirect(target);
}

export async function signOut(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
