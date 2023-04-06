import { test, expect } from "@playwright/test";

test("Can navigate to pickup sheets", async ({ page }) => {
  // TODO: Move to process.env.BASE_URL or something
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Pickup Sheets" }).click();

  await expect(page).toHaveTitle(/Pickup Sheets/);
});
