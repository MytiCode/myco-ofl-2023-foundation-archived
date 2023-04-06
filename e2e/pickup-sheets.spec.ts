import { test, expect } from "@playwright/test";

test("Can navigate to pickup sheets", async ({ page }) => {
  // TODO: Move to process.env.BASE_URL or something
  await page.goto("http://localhost:3000/");

  await page.getByTestId("nav-pickup-sheets").click();

  await expect(page).toHaveTitle(/Pickup Sheets/);
});
