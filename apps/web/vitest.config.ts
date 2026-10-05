import { config } from "dotenv";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Integration tests talk to the real local database.
config({ path: ".env.local", quiet: true });

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    include: ["src/tests/**/*.test.{ts,tsx}"],
    globals: true,
    // Integration tests share one database; keep them off each other.
    fileParallelism: false,
    testTimeout: 20_000,
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
