import { defineConfig, devices } from "@playwright/test";

/** Mobile-first: the Care Show pages are reached by QR code, so iPhone-class
 *  viewports are a primary target, not an afterthought. */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : [["list"]],
  use: {
    // Pinned to 4321 so the app never collides with other local projects.
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:4321",
    // Functional specs run under reduced motion. Smooth anchor scrolling means
    // an off-screen control is still animating when Playwright's actionability
    // check samples it, so clicks time out non-deterministically. Reduced
    // motion is a first-class supported experience here, not a test-only hack —
    // and motion itself is covered explicitly in motion.spec.ts.
    reducedMotion: "reduce",
    trace: "on-first-retry",
  },
  projects: [
    { name: "mobile", use: { ...devices["iPhone 13"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
