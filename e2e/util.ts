import { test as base } from "@playwright/test";
import { PackingSlipsPage, PickupSheetsPage } from "./pages";
import { DeliveryLabelsPage } from "./pages/DeliveryLabelsPage";
import { OrderTrackingSheetsPage } from "./pages/OrderTrackingSheetsPage";

export const test = base.extend<{
  packingSlipsPage: PackingSlipsPage;
  pickupSheetsPage: PickupSheetsPage;
  deliveryLabelsPage: DeliveryLabelsPage;
  orderTrackingSheetsPage: OrderTrackingSheetsPage;
}>({
  packingSlipsPage: async ({ page }, use) => {
    use(new PackingSlipsPage(page));
  },
  pickupSheetsPage: async ({ page }, use) => {
    use(new PickupSheetsPage(page));
  },
  deliveryLabelsPage: async ({ page }, use) => {
    use(new DeliveryLabelsPage(page));
  },
  orderTrackingSheetsPage: async ({ page }, use) => {
    use(new OrderTrackingSheetsPage(page));
  },
});
