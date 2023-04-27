import { formatDate } from ":util";
import { expect } from "@playwright/test";
import { test } from "./util";
import { PackingSlipsPage } from "./pages";
import { WellKnownOrders } from "./fixtures";
import { AuthDriver } from "./drivers/AuthDriver";

test("Can navigate to packing slips", async ({
  auth,
  page,
  packingSlipsPage,
}) => {
  await auth.forceLogin();

  await page.goto("/");

  await packingSlipsPage.nav.click("packing-slips");

  await expect(packingSlipsPage.page).toHaveTitle(/Packing Slips/);
});

test("Can view packing slips", async ({ auth, packingSlipsPage }) => {
  await auth.forceLogin();

  const expectedOrder = WellKnownOrders.fulfilled;

  await packingSlipsPage.goto();

  // Order data
  const firstOrder = packingSlipsPage.getOrder(expectedOrder.orderNumber);
  await expect(firstOrder.el).toContainText(
    formatDate(expectedOrder.createdAt)
  );

  // Shipping info
  const { shippingAddress: expectedAddress } = expectedOrder;
  await expect(firstOrder.el).toContainText(
    `${expectedAddress.firstName} ${expectedAddress.lastName}`
  );
  await expect(firstOrder.el).toContainText(
    `${expectedAddress.address1}, ${expectedAddress.city}, ${expectedAddress.state} ${expectedAddress.zip}`
  );

  for (const expectedItem of expectedOrder.lineItems) {
    const shop = firstOrder.getShop(expectedItem.shop.name);
    await expect(shop.el).toBeVisible();

    const lineItem = shop.getLineItem(expectedItem.title);
    await expect(lineItem.el).toBeVisible();
    await expect(lineItem.img).toHaveAttribute("src", expectedItem.imageSrc);
    await expect(lineItem.el).toContainText(`SKU: ${expectedItem.sku}`);
    await expect(lineItem.qty).toHaveText(String(expectedItem.qtyFulfilled));
  }
});

test("Partially fulfilled items show an explanatory note", async ({
  auth,
  packingSlipsPage,
}) => {
  await auth.forceLogin();

  const expectedOrder = WellKnownOrders.partiallyFulfilled;

  await packingSlipsPage.goto();

  const partiallyUnfulfilledOrder = packingSlipsPage.getOrder(
    expectedOrder.orderNumber
  );

  for (const expectedItem of expectedOrder.lineItems) {
    const shop = partiallyUnfulfilledOrder.getShop(expectedItem.shop.name);
    await expect(shop.el).toBeVisible();

    // TODO: Consider asterisk here to note at bottom saying we'll email to communicate refunds for items that were not fulfillable
    // Lengthen the line length
    const item = shop.getLineItem(expectedItem.title);
    expect(item.qty).toHaveText(String(expectedItem.qtyFulfilled));
    const expectedAvailableText = expectedItem.qtyFulfilled
      ? `Only ${expectedItem.qtyFulfilled} available`
      : "None available";
    await expect(item.el).toContainText(
      `QTY Ordered: ${expectedItem.qty} (${expectedAvailableText})`
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
  let packingSlipsPage: PackingSlipsPage, afterAll: () => Promise<void>;
  test.beforeAll(async ({ browser, tokenSigner }) => {
    const page = await browser.newPage();
    const auth = new AuthDriver(page, tokenSigner);
    await auth.forceLogin();
    packingSlipsPage = new PackingSlipsPage(page);
    await packingSlipsPage.goto();
    await packingSlipsPage.forPrint();
    afterAll = () => page.close();
  });

  test.afterAll(async () => {
    await afterAll();
  });

  test("Initials box is visible", async () => {
    await expect(packingSlipsPage.initials.first()).toBeVisible();
  });

  test.skip("Each order is on its own page", async () => {});
});

// Chose not to invest effort in verifying in the web that the images are resized and not too large
// Could probably download the image and ensure the dimensions are not larger than X or the filesize isn't larger than X
test.skip("Packing slip images are a reasonable size", () => {});
