import { expect } from "@playwright/test";
import { test } from "./util";

test("Can navigate to order tracking sheets", async ({
  page,
  orderTrackingSheetsPage,
}) => {
  await page.goto("/");

  await orderTrackingSheetsPage.nav.click("order-tracking-sheets");

  await expect(orderTrackingSheetsPage.page).toHaveTitle(
    /Order Tracking Sheets/
  );
});
