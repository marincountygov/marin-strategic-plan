import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { UNLOCK_STORAGE_KEY } from "../src/lib/site-lock";

/**
 * Covers the TEST-phase password gate (SiteLock) itself — a11y.spec.ts
 * pre-unlocks it for every other test, so this is the only place the
 * locked/wrong-password/unlocked states actually get exercised.
 */
test("shows the password form when locked, rejects a wrong password, and unlocks on the right one", async ({
  page,
}) => {
  await page.goto("/");

  const passwordInput = page.getByLabel("Password");
  await expect(passwordInput).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await passwordInput.fill("not-the-password");
  await page.getByRole("button", { name: "Continue" }).click();
  // Not getByRole("alert") — Next's own route announcer also carries
  // role="alert" and would make that locator ambiguous.
  await expect(page.locator("#site-password-error")).toHaveText("Incorrect password.");

  await passwordInput.fill("strategicplan2026");
  await page.getByRole("button", { name: "Continue" }).click();

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
  await expect(
    page.evaluate((key) => sessionStorage.getItem(key), UNLOCK_STORAGE_KEY),
  ).resolves.toBe("1");
});

test("the login form itself passes an axe scan", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByLabel("Password")).toBeVisible();

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
