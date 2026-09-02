import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { UNLOCK_STORAGE_KEY } from "../src/lib/site-lock";

/**
 * WCAG 2.2 AA scan over every route, in light, dark, and mobile projects.
 *
 * Automated scanning catches roughly a third of WCAG failures. It is the
 * floor, not the audit: keyboard walkthroughs and screen-reader checks are
 * still expected on new interactive work (see AGENTS.md § Accessibility).
 *
 * Every route sits behind the TEST-phase password gate (SiteLock), so each
 * test pre-unlocks it via sessionStorage before navigating — otherwise every
 * one of these would just be scanning the login form.
 */
test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ([key]) => sessionStorage.setItem(key, "1"),
    [UNLOCK_STORAGE_KEY],
  );
});

const ROUTES = ["/", "/about", "/design-tokens"];

for (const route of ROUTES) {
  test(`axe: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("skip link is first focusable and lands on main", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Skip to main content" });
  await expect(skipLink).toBeFocused();
  await skipLink.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});
