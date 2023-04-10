import { expect } from "@playwright/test";
import { PickupSheetsPage } from "./pages";
import { test } from "./util";

test("Can navigate to pickup sheets", async ({ page, pickupSheetsPage }) => {
  await page.goto("/");

  await pickupSheetsPage.nav.click("pickup-sheets");

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});

test("Can view pickup sheets", async ({ pickupSheetsPage }) => {
  await pickupSheetsPage.goto();

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);

  // Shop data
  const shop = pickupSheetsPage.getShop("Homeport");
  await expect(shop.el).toBeVisible();
  await expect(shop.el).toContainText("52 Church Street, Burlington, VT 05401");

  // Order
  const order = shop.getOrder("#1226-2");
  await expect(order.el).toBeVisible();

  // Line item: id, photo, qty, partial fulfillment note
  const lineItem = order.getLineItem("Auric Blends Perfume Oil - Moonlight");
  await expect(lineItem.el).toBeVisible();
  await expect(lineItem.el).toContainText("Line Item ID: 11352135467177");
  await expect(lineItem.qty).toHaveText("1");
  await expect(lineItem.img).toHaveAttribute(
    "src",
    "https://cdn.shopify.com/s/files/1/0578/9899/1785/products/PerfumeArmy_grande__06524.1649704087.386.513.jpg?v=1653412449&width=400"
  );
});

test("Partially fulfilled items show an explanatory note", async ({
  pickupSheetsPage,
}) => {
  await pickupSheetsPage.goto();

  const partiallyUnfulfilledOrder = pickupSheetsPage
    .getShop("Homeport")
    .getOrder("#1514-3");

  await expect(partiallyUnfulfilledOrder.el).toBeVisible();

  // TODO: Consider asterisk here to note at bottom saying we'll email to communicate refunds for items that were not fulfillable
  // Lengthen the line length
  await expect(
    partiallyUnfulfilledOrder.getLineItem("Any Occasion - Whatever").el
  ).toContainText("QTY Ordered: 2 (Only 1 available)");

  await expect(
    partiallyUnfulfilledOrder.getLineItem("Cocktail Bomb Lovely Spritzer").el
  ).toContainText("QTY Ordered: 2 (None available)");
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
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    pickupSheetsPage = new PickupSheetsPage(page);
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
