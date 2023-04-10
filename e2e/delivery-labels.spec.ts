import { expect } from "@playwright/test";
import { test } from "./util";

test("Can navigate to delivery labels", async ({
  page,
  deliveryLabelsPage,
}) => {
  await page.goto("/");

  await deliveryLabelsPage.nav.click("delivery-labels");

  await expect(deliveryLabelsPage.page).toHaveTitle(/Delivery Labels/);
});

test("Can view delivery labels", async ({ deliveryLabelsPage }) => {
  await deliveryLabelsPage.goto();

  await expect(deliveryLabelsPage.page).toHaveTitle(/Delivery Labels/);

  const label = deliveryLabelsPage.getLabel("#1226-2");
  await expect(label.el).toBeVisible();

  await expect(label.logo).toBeVisible();

  await expect(label.el).toContainText("Nobody Jones");
  await expect(label.el).toContainText("9999 Excellent Drive, Apt 1");
  await expect(label.el).toContainText("Burlington, VT 05401");

  await expect(label.el).toContainText("Delivered By");
});
