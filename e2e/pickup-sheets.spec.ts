import { expect } from "@playwright/test";
import { test } from "./util";

test("Can navigate to pickup sheets", async ({ page, pickupSheetsPage }) => {
  await page.goto("/");

  await pickupSheetsPage.nav.click("pickup-sheets");

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});

test("Can view pickup sheets", async ({ pickupSheetsPage }) => {
  await pickupSheetsPage.goto();

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});
