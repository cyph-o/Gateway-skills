import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * node-postgres rather than the Neon HTTP driver: the capture path commits a
 * lead and its outbox row in one interactive transaction, which the HTTP driver
 * cannot express. Works unchanged against local Postgres and Neon's pooler.
 *
 * The pool is cached on globalThis so serverless invocations reuse connections
 * instead of exhausting the database on a traffic spike.
 */
const globalForDb = globalThis as unknown as { __gatewayPool?: Pool };

function pool(): Pool {
  if (!globalForDb.__gatewayPool) {
    const url = serverEnv().DATABASE_URL;
    globalForDb.__gatewayPool = new Pool({
      connectionString: url,
      // Managed providers require TLS; a local socket/host does not.
      ssl: /localhost|127\.0\.0\.1/.test(url) ? false : { rejectUnauthorized: true },
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
    });
  }
  return globalForDb.__gatewayPool;
}

export function db() {
  return drizzle(pool(), { schema });
}

export type Database = ReturnType<typeof db>;
export { schema };
