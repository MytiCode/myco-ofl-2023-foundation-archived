import { expect } from "@playwright/test";
import { test } from "./util";
import * as XLSX from "xlsx";
import {
  OrderTrackingSheetConfig,
  OrderTrackingSheetLabel,
} from "../src/pages/order-tracking-sheets";
import * as os from "os";
import * as path from "path";

class OrderTrackingSheetReader {
  constructor(
    private config: OrderTrackingSheetConfig = new OrderTrackingSheetConfig()
  ) {}

  read(path: string) {
    const book = XLSX.readFile(path);

    const sheets = new Map<OrderTrackingSheetLabel, any[]>();
    this.config.sheets.forEach(({ label, columnNames }) => {
      sheets.set(
        label,
        XLSX.utils
          .sheet_to_json(book.Sheets[label], {
            header: columnNames,
          })
          .slice(1)
      );
    });

    return sheets;
  }
}

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
  expect(download.suggestedFilename()).toEqual("Order Tracking Sheet.xlsx");

  // TODO: What path to use that works for local and CI?
  // Delete the path afterwards or just put it somewhere tmp?
  // TODO: Should we use createReadStream rather than saving to disk and then reading?
  const tmpPath = path.join(os.tmpdir(), `doesnt-matter-${Date.now()}.xlsx`);
  await download.saveAs(tmpPath);

  const sheets = new OrderTrackingSheetReader().read(tmpPath);

  // Orders
  const orders = sheets.get("Orders");
  if (!orders) throw new Error("Expected orders to exist");
  expect(orders.length).toBeGreaterThan(0);
  const order = orders[0];
  expect(order).toBeDefined();
  expect(order.orderNumber).toEqual("#1226-2");
  expect(order.shopName).toEqual("Homeport");
  expect(order.fulfillmentStatus).toEqual("unfulfilled");

  // Line items
  const lineItems = sheets.get("Line Items");
  if (!lineItems) throw new Error("Expected line items to exist");
  expect(lineItems.length).toBeGreaterThan(0);
  const lineItem = lineItems[0];
  expect(lineItem).toBeDefined();
  expect(lineItem.orderNumber).toEqual("#1226-2");
  expect(lineItem.title).toEqual("Auric Blends Perfume Oil - Moonlight");
  expect(lineItem.qty).toEqual("1");
  expect(lineItem.qtyFulfilled).toEqual("1");
  expect(lineItem.lineItemId).toEqual("11352135467177");
});
