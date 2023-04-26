import { test as base } from "@playwright/test";
import { PackingSlipsPage, PickupSheetsPage } from "./pages";
import { DeliveryLabelsPage } from "./pages/DeliveryLabelsPage";
import { OrderTrackingSheetsPage } from "./pages/OrderTrackingSheetsPage";
import jwt from "jsonwebtoken";
import { Err, Ok, Result } from "ts-results";
import { z } from "zod";

type User = {
  userId: string;
};

export type SigningKey = {
  readonly keyId: string;
  readonly privateKey: string;
};

class TokenSigner {
  constructor(private key: SigningKey) {}

  sign(user: User): Result<string, Error> {
    const payload = {
      sub: user.userId,
    };

    try {
      const token = jwt.sign(payload, this.key.privateKey, {
        algorithm: "RS256",
        keyid: this.key.keyId,
      });

      return Ok(token);
    } catch (e) {
      return Err(e as Error);
    }
  }
}

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
