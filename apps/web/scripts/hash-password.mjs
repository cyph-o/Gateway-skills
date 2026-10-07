#!/usr/bin/env node
/**
 * Generates an ADMIN_PASSWORD_HASH for the admin dashboard.
 *
 *   node scripts/hash-password.mjs "your-password-here"
 *
 * Put the output in ADMIN_PASSWORD_HASH. The plaintext is never stored.
 */
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);
const password = process.argv[2];

if (!password || password.length < 12) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  console.error("The password must be at least 12 characters.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const derived = await scryptAsync(password, salt, 64);
console.log(`${salt}:${derived.toString("hex")}`);
