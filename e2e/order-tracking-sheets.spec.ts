import { expect } from "@playwright/test";
import { test } from "./util";
import * as XLSX from "xlsx";
import { OrderTrackingSheetConfig } from "../src/pages/order-tracking-sheets";

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

test("Can download order tracking sheet", async ({
  page,
  orderTrackingSheetsPage,
}) => {
  const downloadPromise = page.waitForEvent("download");

  await orderTrackingSheetsPage.goto();

  const download = await downloadPromise;
  expect(download.suggestedFilename()).toEqual("test.xlsx");

  // TODO: What path to use that works for local and CI?
  // Delete the path afterwards or just put it somewhere tmp?
  // TODO: Should we use createReadStream rather than saving to disk and then reading?
  const path = `something-${Date.now()}.xlsx`;
  await download.saveAs(path);

  const book = XLSX.readFile(path);

  const config = new OrderTrackingSheetConfig();
  const ordersSheetLabel = "Orders";
  const orders: any[] = XLSX.utils
    .sheet_to_json(book.Sheets[ordersSheetLabel], {
      header: config.forSheet(ordersSheetLabel).columnNames,
    })
    .slice(1);

  expect(orders.length).toBeGreaterThan(0);
  const order = orders[0];
  expect(order).toBeDefined();
  expect(order.orderNumber).toEqual("#1226-2");
  expect(order.shopName).toEqual("Homeport");
  expect(order.fulfillmentStatus).toEqual("unfulfilled");

  const lineItemsSheetLabel = "Line Items";
  const lineItems: any[] = XLSX.utils
    .sheet_to_json(book.Sheets[lineItemsSheetLabel], {
      header: config.forSheet(lineItemsSheetLabel).columnNames,
    })
    .slice(1);
  expect(lineItems.length).toBeGreaterThan(0);
  const lineItem = lineItems[0];
  expect(lineItem).toBeDefined();
  expect(lineItem.orderNumber).toEqual("#1226-2");
  expect(lineItem.title).toEqual("Auric Blends Perfume Oil - Moonlight");
  expect(lineItem.qty).toEqual("1");
  expect(lineItem.qtyFulfilled).toEqual("1");
  expect(lineItem.lineItemId).toEqual("11352135467177");
});
