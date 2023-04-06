import { test, expect } from "@playwright/test";

test("Can navigate to packing slips", async ({ page }) => {
  // TODO: Move to process.env.BASE_URL or something
  await page.goto("http://localhost:3000/");

  await page.getByTestId("nav-packing-slips").click();

  await expect(page).toHaveTitle(/Packing Slips/);
});
