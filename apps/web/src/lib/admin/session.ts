/**
 * Admin session tokens.
 *
 * Signed with Web Crypto rather than node:crypto so the same code verifies in
 * `proxy.ts` (which may run on the edge) and in server actions. The token
 * carries only an expiry and a version — no identity, no permissions — so a
 * stolen cookie grants nothing beyond a session that is already expiring.
 */
export const ADMIN_COOKIE = "gsn_admin";
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

/** Bump to invalidate every existing session at once. */
const TOKEN_VERSION = 1;

interface TokenPayload {
  v: number;
  exp: number;
}

const encoder = new TextEncoder();

function base64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(value: string): ArrayBuffer {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  // Return the buffer itself: Web Crypto wants a BufferSource, and a
  // Uint8Array view is not assignable under this TS lib configuration.
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function key(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSessionToken(secret: string): Promise<string> {
  const payload: TokenPayload = {
    v: TOKEN_VERSION,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64url(encoder.encode(JSON.stringify(payload)));
  const signature = await crypto.subtle.sign("HMAC", await key(secret), encoder.encode(body));
  return `${body}.${base64url(new Uint8Array(signature))}`;
}

/**
 * Verifies signature, version and expiry. `crypto.subtle.verify` is
 * constant-time, so this does not leak the secret through timing.
 */
export async function verifySessionToken(token: string | undefined, secret: string) {
  if (!token) return false;
  const [body, signature] = token.split(".");
  if (!body || !signature) return false;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await key(secret),
      fromBase64url(signature),
      encoder.encode(body),
    );
    if (!valid) return false;

    const payload = JSON.parse(
      new TextDecoder().decode(new Uint8Array(fromBase64url(body))),
    ) as TokenPayload;
    if (payload.v !== TOKEN_VERSION) return false;
    return payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
