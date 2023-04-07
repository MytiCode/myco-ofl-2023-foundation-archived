import { formatDate } from "../src/util";
import { test, expect, Page } from "@playwright/test";

test("Can navigate to pickup sheets", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("nav-pickup-sheets").click();

  await expect(page).toHaveTitle(/Pickup Sheets/);
});

test("Can view packing slips", async ({ page }) => {
  await page.goto("/packing-slips");

  // Order data
  const firstOrder = page.getByLabel("#1226-2");
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

// We may want to test this in a view model test
test.describe("Sorting", () => {
  test.skip("Orders are sorted by order date", () => {});
  test.skip("Shops are sorted by name", () => {});
  test.skip("Line items are sorted by title", () => {});
});

test.describe("Printing", () => {
  let page: Page;
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto("/packing-slips");
    await page.emulateMedia({ media: "print" });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Initials box is visible", async () => {
    await expect(page.getByText("Initials").first()).toBeVisible();
  });

  test.skip("Each order is on its own page", async () => {});
});

// Chose not to invest effort in verifying in the web that the images are resized and not too large
// Could probably download the image and ensure the dimensions are not larger than X or the filesize isn't larger than X
test.skip("Packing slip images are a reasonable size", () => {});
