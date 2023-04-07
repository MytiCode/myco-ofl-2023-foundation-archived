import { test, expect } from "@playwright/test";

test("Can navigate to pickup sheets", async ({ page }) => {
  await page.goto("/");

  await page.getByTestId("nav-pickup-sheets").click();

  await expect(page).toHaveTitle(/Pickup Sheets/);
});

test("Can view packing slips", async ({ page }) => {
  await page.goto("/packing-slips");

  // Order data
  const firstOrder = page.getByLabel("#1226");
  await expect(firstOrder).toContainText("Jun 6, 2022, 11:16 AM");

  // Shipping info
  await expect(firstOrder).toContainText("Nobody Jones");
  await expect(firstOrder).toContainText(
    "9999 Excellent Drive Apt 1, Burlington, VT 05401"
  );

  // Line items
  const lineItems = firstOrder.getByLabel("Line Items").getByRole("listitem");
  await expect(lineItems).toHaveCount(2);

  const lineItem = lineItems.filter({
    hasText: "Auric Blends Perfume Oil - Moonlight",
  });
  await expect(lineItem).toBeVisible();
  await expect(lineItem.getByLabel("Shop Name")).toHaveText("Homeport");
  await expect(lineItem.getByRole("img")).toHaveAttribute(
    "src",
    "https://cdn.shopify.com/s/files/1/0578/9899/1785/products/PerfumeArmy_grande__06524.1649704087.386.513.jpg?v=1653412449"
  );
  await expect(lineItem).toContainText("SKU: 114658");
  await expect(lineItem.getByLabel("Quantity Ordered")).toHaveText("1");
  // await expect(lineItem.getByLabel("Quantity Fulfilled")).toHaveText("1");

  // TODO: Partial fulfillment message
});
