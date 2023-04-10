import { expect } from "@playwright/test";
import { test } from "./util";

test("Can navigate to pickup sheets", async ({ pickupSheetsPage }) => {
  await pickupSheetsPage.goto();

  await pickupSheetsPage.nav.click("pickup-sheets");

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});
