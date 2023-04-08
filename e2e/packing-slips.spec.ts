import { formatDate } from "../src/util";
import { expect, Page } from "@playwright/test";
import { test } from "./util";
import { PackingSlipsPage } from "./pages";

test("Can navigate to packing slips", async ({ packingSlipsPage }) => {
  await packingSlipsPage.goto();

  await packingSlipsPage.nav.click("packing-slips");

  await expect(packingSlipsPage.page).toHaveTitle(/Packing Slips/);
});

test("Can view packing slips", async ({ packingSlipsPage }) => {
  await packingSlipsPage.goto();

  // Order data
  const firstOrder = packingSlipsPage.getOrder("#1226-2");
  await expect(firstOrder).toContainText(
    formatDate("2022-06-06T15:16:13+00:00")
  );

  // Shipping info
  await expect(firstOrder).toContainText("Nobody Jones");
  await expect(firstOrder).toContainText(
    "9999 Excellent Drive Apt 1, Burlington, VT 05401"
  );

  // Shops on the first order
  const homeport = firstOrder.getByLabel("Homeport");
  await expect(homeport).toBeVisible();
  await expect(homeport.getByRole("listitem")).toHaveCount(1);

  // Ideally would stress having multiple items
  const sidepony = firstOrder.getByLabel("SidePony Boutique");
  await expect(sidepony).toBeVisible();
  await expect(sidepony.getByRole("listitem")).toHaveCount(1);

  // Just check the homeport Line items
  const lineItem = homeport.getByLabel("Auric Blends Perfume Oil - Moonlight");
  await expect(lineItem).toBeVisible();
  await expect(lineItem.getByRole("img")).toHaveAttribute(
    "src",
    "https://cdn.shopify.com/s/files/1/0578/9899/1785/products/PerfumeArmy_grande__06524.1649704087.386.513.jpg?v=1653412449&width=400"
  );
  await expect(lineItem).toContainText("SKU: 114658");
  await expect(lineItem.getByLabel("Quantity Ordered")).toHaveText("1");

  // TODO: Can't currently do this cos we dont know the value
  // await expect(lineItem.getByLabel("Quantity Fulfilled")).toHaveText("1");

  // TODO: Partial fulfillment message
});

test("Partially fulfilled items show an explanatory note", async ({
  packingSlipsPage,
}) => {
  await packingSlipsPage.goto();

  const partiallyUnfulfilledOrder = packingSlipsPage.getOrder("#1514-3");

  const homeport = partiallyUnfulfilledOrder.getByLabel("Homeport");
  await expect(homeport).toBeVisible();

  const partiallyFulfilledLineItem = homeport.getByLabel(
    "Any Occasion - Whatever"
  );
  // TODO: Consider asterisk here to note at bottom saying we'll email to communicate refunds for items that were not fulfillable
  await expect(partiallyFulfilledLineItem).toContainText(
    "QTY Ordered: 2 (Only 1 available)"
  );

  const unfulfilledLineItem = homeport.getByLabel(
    "Cocktail Bomb Lovely Spritzer"
  );
  await expect(unfulfilledLineItem).toContainText(
    "QTY Ordered: 1 (None available)"
  );
});

// We may want to test this in a view model test
test.describe("Sorting", () => {
  test.skip("Orders are sorted by order date", () => {});
  test.skip("Shops are sorted by name", () => {});
  test.skip("Line items are sorted by title", () => {});
});

test.describe("Printing", () => {
  let packingSlipsPage: PackingSlipsPage, afterAll: () => Promise<void>;
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
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
