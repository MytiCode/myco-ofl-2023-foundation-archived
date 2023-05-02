import { expect } from "@playwright/test";
import { test } from "./util";
import { WellKnownOrders } from "./fixtures";

test("Can navigate to delivery labels", async ({
  auth,
  page,
  deliveryLabelsPage,
}) => {
  await auth.forceLogin();

  await page.goto("/");

  await deliveryLabelsPage.nav.click("delivery-labels");

  await expect(deliveryLabelsPage.page).toHaveTitle(/Delivery Labels/);
});

test("Can view delivery labels", async ({ auth, deliveryLabelsPage }) => {
  await auth.forceLogin();

  const expectedOrder = WellKnownOrders.fulfilled;

  await deliveryLabelsPage.goto();

  await expect(deliveryLabelsPage.page).toHaveTitle(/Delivery Labels/);

  const label = deliveryLabelsPage.getLabel(expectedOrder.orderNumber);
  await expect(label.el).toBeVisible();

  await expect(label.logo).toBeVisible();

  const { shippingAddress: expectedAddress } = expectedOrder;
  await expect(label.el).toContainText(
    `${expectedAddress.firstName} ${expectedAddress.lastName}`
  );

  // Not stressing address2, forgot to populate when creating order
  await expect(label.el).toContainText(`${expectedAddress.address1}`);
  await expect(label.el).toContainText(
    `${expectedAddress.city}, ${expectedAddress.state} ${expectedAddress.zip}`
  );

  await expect(label.el).toContainText("Delivered By");
});
