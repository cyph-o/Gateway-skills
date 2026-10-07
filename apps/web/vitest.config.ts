import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

config({ path: ".env.local", quiet: true });

// Integration tests exercise whichever driver is configured, but never the
// store the developer is using: a temp file keeps seeded fixtures out of
// .data/leads.json.
process.env.LEAD_STORE_FILE ??= fileURLToPath(
  new URL("./.data/test-leads.json", import.meta.url),
);

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.{ts,tsx}"],
    globals: true,
    // Integration tests share one store; keep them off each other.
    fileParallelism: false,
    testTimeout: 20_000,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
