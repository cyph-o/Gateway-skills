type Level = "debug" | "info" | "warn" | "error";

const REDACTED = new Set([
  "email",
  "emailNormalised",
  "mobileNumber",
  "fullName",
  "companyName",
  "authorization",
  "cookie",
]);

/** Drops personal data and secrets before anything reaches the log stream. */
function redact(context: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(context).map(([k, v]) => [k, REDACTED.has(k) ? "[redacted]" : v]),
  );
}

function emit(level: Level, event: string, context: Record<string, unknown> = {}): void {
  const line = JSON.stringify({
    level,
    event,
    at: new Date().toISOString(),
    ...redact(context),
  });
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  debug: (e: string, c?: Record<string, unknown>) => emit("debug", e, c),
  info: (e: string, c?: Record<string, unknown>) => emit("info", e, c),
  warn: (e: string, c?: Record<string, unknown>) => emit("warn", e, c),
  error: (e: string, c?: Record<string, unknown>) => emit("error", e, c),
};
