import { defineConfig, devices } from "@playwright/test";

/**
 * Accessibility test run. Serves the static export from out/, so run
 * `npm run build` first (npm run verify sequences this correctly).
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4173",
  },
  projects: [
    {
      name: "light",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
    },
    {
      name: "dark",
      use: { ...devices["Desktop Chrome"], colorScheme: "dark" },
    },
    {
      // Chromium-based so CI needs only one browser install.
      name: "mobile",
      use: { ...devices["Pixel 7"], colorScheme: "light" },
    },
  ],
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
