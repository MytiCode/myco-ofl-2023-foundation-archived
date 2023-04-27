import { test as base } from "@playwright/test";
import { PackingSlipsPage, PickupSheetsPage } from "./pages";
import { DeliveryLabelsPage } from "./pages/DeliveryLabelsPage";
import { OrderTrackingSheetsPage } from "./pages/OrderTrackingSheetsPage";
import { z } from "zod";
import { TokenSigner } from "./auth";

export const test = base.extend<{
  packingSlipsPage: PackingSlipsPage;
  pickupSheetsPage: PickupSheetsPage;
  deliveryLabelsPage: DeliveryLabelsPage;
  orderTrackingSheetsPage: OrderTrackingSheetsPage;
  tokenSigner: TokenSigner;
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
  tokenSigner: async ({}, use) => {
    use(
      new TokenSigner(
        z
          .object({
            keyId: z.string().min(1),
            privateKey: z.string().min(1),
          })
          .parse({
            keyId: process.env.TEST_AUTH_KEY_ID,
            privateKey: process.env.TEST_AUTH_PRIVATE_KEY,
          })
      )
    );
  },
});
