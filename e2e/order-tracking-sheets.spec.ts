import { expect } from "@playwright/test";
import { test } from "./util";
import * as XLSX from "xlsx";
import * as os from "os";
import * as path from "path";
import {
  OrderTrackingSheetConfig,
  OrderTrackingSheetLabel,
} from ":orders/order-tracking-sheets/OrderTrackingSheetConfig";
import { WellKnownOrders } from "./fixtures";

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
  auth,
  page,
  orderTrackingSheetsPage,
}) => {
  await auth.forceLogin();

  await page.goto("/");

  await orderTrackingSheetsPage.nav.click("order-tracking-sheets");

  await expect(orderTrackingSheetsPage.page).toHaveTitle(
    /Order Tracking Sheets/
  );
});

test("Can download order tracking sheet", async ({
  auth,
  page,
  orderTrackingSheetsPage,
}) => {
  await auth.forceLogin();

  const downloadPromise = page.waitForEvent("download");

  await orderTrackingSheetsPage.goto();

  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(
    /Order Tracking Sheet - \d\d\d\d-\d\d-\d\d-\d\d-\d\d-[A|P]M.xlsx/
  );

  // Is there some way to use download.createReadStream to avoid saving to disk?
  const tmpPath = path.join(os.tmpdir(), `doesnt-matter-${Date.now()}.xlsx`);
  await download.saveAs(tmpPath);

  const sheets = new OrderTrackingSheetReader().read(tmpPath);

  // Orders
  const expectedOrders = [
    WellKnownOrders.fulfilled,
    WellKnownOrders.partiallyFulfilled,
  ];

  const orders = sheets.get("Orders");
  const lineItems = sheets.get("Line Items");

  // Throw to narrow to array
  if (!orders) throw new Error("Expected orders sheet to exist");
  if (!lineItems) throw new Error("Expected line items sheet to exist");

  expect(orders.length).toBeGreaterThanOrEqual(expectedOrders.length);
  expect(lineItems.length).toBeGreaterThan(0);

  for (const expectedOrder of expectedOrders) {
    const orderRows = orders.filter(
      (o) => o.orderNumber === expectedOrder.orderNumber
    );
    expect(orderRows.length).toBe(2);

    for (const expectedItem of expectedOrder.lineItems) {
      // Should be an order row for that item
      // We don't need to assert this for each item but it doesn't hurt
      const order = orderRows.find(
        (o) => o.shopName === expectedItem.shop.name
      );
      expect(order).toBeDefined();
      expect(order.fulfillmentStatus).toEqual("READY_FOR_PICKUP");

      // Should be a line item row for that item
      const lineItemRows = lineItems.filter(
        (li) =>
          li.orderNumber === expectedOrder.orderNumber &&
          li.lineItemId === String(expectedItem.lineItemId)
      );
      expect(lineItemRows).toHaveLength(1);

      const [lineItem] = lineItemRows;
      expect(lineItem.orderNumber).toEqual(expectedOrder.orderNumber);
      expect(lineItem.shopName).toEqual(expectedItem.shop.name);
      expect(lineItem.title).toEqual(expectedItem.title);
      expect(lineItem.fulfillmentStatus).toEqual(
        expectedItem.fulfillmentStatus
      );
      expect(lineItem.qty).toEqual(String(expectedItem.qty));
      expect(lineItem.qtyFulfilled).toEqual(String(expectedItem.qtyFulfilled));
    }
  }
});
