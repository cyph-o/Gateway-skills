import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

/**
 * Admin password verification.
 *
 * The password is stored as a scrypt hash, never in plaintext — an env var is
 * readable by anyone with dashboard access or a leaked deploy log, and this
 * one guards every lead's name, email and phone number.
 *
 * Generate a hash with:
 *   node -e "require('./scripts/hash-password.mjs')" <password>
 */
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;

  try {
    const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
    const expectedBuffer = Buffer.from(expected, "hex");
    // Length check first: timingSafeEqual throws on a mismatch.
    if (expectedBuffer.length !== derived.length) return false;
    return timingSafeEqual(derived, expectedBuffer);
  } catch {
    return false;
  }
}
