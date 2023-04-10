import { test as base } from "@playwright/test";
import { PackingSlipsPage, PickupSheetsPage } from "./pages";

export const test = base.extend<{
  packingSlipsPage: PackingSlipsPage;
  pickupSheetsPage: PickupSheetsPage;
}>({
  packingSlipsPage: async ({ page }, use) => {
    use(new PackingSlipsPage(page));
  },
  pickupSheetsPage: async ({ page }, use) => {
    use(new PickupSheetsPage(page));
  },
});
