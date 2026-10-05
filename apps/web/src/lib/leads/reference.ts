import { randomInt } from "node:crypto";

/** Crockford-style alphabet: no I, L, O, U, 0 or 1 — unambiguous when a lead
 *  reference is read aloud down a phone line. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Public, non-sequential lead handle, e.g. "GSN-7F3K2Q". Shown to the visitor
 * and quoted in the internal notification; the row's UUID is never exposed.
 * ~24 bits of entropy, with a unique index as the real guard.
 */
export function generateReference(): string {
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `GSN-${body}`;
}
