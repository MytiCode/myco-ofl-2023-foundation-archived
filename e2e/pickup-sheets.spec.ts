import { expect } from "@playwright/test";
import { PickupSheetsPage } from "./pages";
import { test } from "./util";
import { WellKnownOrders } from "./fixtures";
import { AuthDriver } from "./drivers/AuthDriver";

test("Can navigate to pickup sheets", async ({
  auth,
  page,
  pickupSheetsPage,
}) => {
  await auth.forceLogin();

  await page.goto("/");

  await pickupSheetsPage.nav.click("pickup-sheets");

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});

test("Can view pickup sheets", async ({ auth, pickupSheetsPage }) => {
  await auth.forceLogin();

  const expectedOrder = WellKnownOrders.fulfilled;

  await pickupSheetsPage.goto();

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);

  for (const {
    shop: expectedShop,
    title,
    lineItemId,
    imageSrc,
    qtyFulfilled,
  } of expectedOrder.lineItems) {
    // Shop data
    const shop = pickupSheetsPage.getShop(expectedShop.name);
    await expect(shop.el).toBeVisible();
    await expect(shop.el).toContainText(expectedShop.address);

    // Order
    const order = shop.getOrder(expectedOrder.orderNumber);
    await expect(order.el).toBeVisible();

    // Line item: id, photo, qty, partial fulfillment note
    const lineItem = order.getLineItem(title);
    await expect(lineItem.el).toBeVisible();
    await expect(lineItem.el).toContainText(`Line Item ID: ${lineItemId}`);

    // TODO(benglass): This is failing b/c API is returning the wrong value here
    // skip til we get a fix so we aren't blocked on adopting API
    await expect(lineItem.qty).toHaveText(String(qtyFulfilled));

    await expect(lineItem.img).toHaveAttribute("src", imageSrc);
  }
});

test("Partially fulfilled items show an explanatory note", async ({
  auth,
  pickupSheetsPage,
}) => {
  await auth.forceLogin();

  const expectedOrder = WellKnownOrders.partiallyFulfilled;
  const expectedLineItems = expectedOrder.lineItems;

  await pickupSheetsPage.goto();

  for (const {
    title,
    shop,
    qty,
    qtyFulfilled,
    fullfillmentStatus,
  } of expectedLineItems) {
    const partiallyUnfulfilledOrder = pickupSheetsPage
      .getShop(shop.name)
      .getOrder(expectedOrder.orderNumber);

    if (fullfillmentStatus === "CANCELLED") {
      await expect(partiallyUnfulfilledOrder.el).not.toBeVisible();
      continue;
    }

    await expect(partiallyUnfulfilledOrder.el).toBeVisible();

    const lineItem = partiallyUnfulfilledOrder.getLineItem(title);

    await expect(lineItem.qty).toHaveText(String(qtyFulfilled));

    await expect(lineItem.el).toContainText(
      `QTY Ordered: ${qty} (${
        qtyFulfilled === 0 ? "None available" : `Only ${qtyFulfilled} available`
      })`
    );
  }
});

// We may want to test this in a view model test
test.describe("Sorting", () => {
  test.skip("Orders are sorted by order date", () => {});
  test.skip("Shops are sorted by name", () => {});
  test.skip("Line items are sorted by title", () => {});
});

test.describe("Filter", () => {
  test.skip("Packing slips are filtered by date", () => {});
  test.skip("Packing slips do not include cancelled orders", () => {});
  test.skip("Packing slips do not include out for delivery/delivered orders", () => {});
});

test.describe("Printing", () => {
  let pickupSheetsPage: PickupSheetsPage, afterAll: () => Promise<void>;
  test.beforeAll(async ({ tokenSigner, browser }) => {
    const page = await browser.newPage();
    const auth = new AuthDriver(page, tokenSigner);
    pickupSheetsPage = new PickupSheetsPage(page);
    await auth.forceLogin();
    await pickupSheetsPage.goto();
    await pickupSheetsPage.forPrint();
    afterAll = () => page.close();
  });

  test.afterAll(async () => {
    await afterAll();
  });

  test.skip("Each shop is on its own page", () => {});

  test("Print only boxes are visible", async () => {
    await expect(pickupSheetsPage.initials.first()).toBeVisible();
    await expect(pickupSheetsPage.pickupDate.first()).toBeVisible();
    await expect(pickupSheetsPage.arriveTime.first()).toBeVisible();
    await expect(pickupSheetsPage.departTime.first()).toBeVisible();
  });
});
