import { expect } from "@playwright/test";
import { PickupSheetsPage } from "./pages";
import { test } from "./util";
import { Myco } from ":api/client";

type TestOrder = {
  orderNumber: Myco.Order["orderNumber"];
  lineItems: Array<{
    lineItemId: number;
    title: Myco.OrderLineItem["title"];
    qty: number;
    qtyFulfilled: number;
    imageSrc: string;
    shop: {
      name: Myco.Shop["name"];
      address: string;
    };
  }>;
};

// const WellKnownOrders: Record<"fulfilled" | "partiallyFulfilled", TestOrder> = {
//   fulfilled: {
//     orderNumber: "#1016-2",
//     lineItems: [
//       {
//         title: "Sleeping Queens",
//         lineItemId: 13799803322683,
//         qty: 2,
//         qtyFulfilled: 2,
//         imageSrc:
//           "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/170227672_fe3b9271-a6bf-4bb4-a41e-40b28aabc1f5.jpg?v=1681828546",
//         shop: {
//           name: "Myti BigC Games",
//           address: "50 Lakeside Avenue, Burlington, VT 05401",
//         },
//       },
//     ],
//   },
//   partiallyFulfilled: {
//     orderNumber: "#1015-2",
//     lineItems: [
//       {
//         title: "Sleeping Queens",
//         lineItemId: 13799803322683,
//         qty: 2,
//         qtyFulfilled: 1,
//         imageSrc:
//           "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/170227672.jpg?v=1680119441",
//         shop: {
//           name: "Myti BigC Games",
//           address: "50 Lakeside Avenue, Burlington, VT 05401",
//         },
//       },
//       {
//         title: "Massive Headphone Travel Pillow",
//         lineItemId: 13799158645051,
//         qty: 2,
//         qtyFulfilled: 0,
//         imageSrc:
//           "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/115681594.jpg?v=1680620869",
//         shop: {
//           name: "Mytify Audio",
//           address: "50 Lakeside Avenue, Burlington, VT 05401",
//         },
//       },
//     ],
//   },
// };

type WellKnownOrderKeys = "fulfilled" | "partiallyFulfilled";

// #1031-2
// ATAT 4D Paper Model Kit
// Line Item ID: 13807499542843

// #1032-2
// ATAT 4D Paper Model Kit
// Line Item ID: 13807502623035
// https://cdn.shopify.com/s/files/1/0733/2030/0859/products/173536198.png?v=1681492715

// #1031-2
// ATAT Darth Vader Earbuds - None More Black
// Line Item ID: 13807499575611

// #1032-2
// ATAT Darth Vader Earbuds - Black
// Line Item ID: 13807502590267
// https://cdn.shopify.com/s/files/1/0733/2030/0859/products/118766225.jpg?v=1682007280

const WellKnownOrders: Record<WellKnownOrderKeys, TestOrder> = {
  fulfilled: {
    orderNumber: "#1031-2",
    lineItems: [
      {
        title: "ATAT 4D Paper Model Kit",
        lineItemId: 13807499542843,
        qty: 2,
        qtyFulfilled: 2,
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/173536198.png?v=1681492715",
        shop: {
          name: "Myti BigC Games",
          address: "50 Lakeside Avenue, Burlington, VT 05401",
        },
      },
    ],
  },
  partiallyFulfilled: {
    orderNumber: "#1032-2",
    lineItems: [
      {
        title: "ATAT 4D Paper Model Kit",
        lineItemId: 13807502623035,
        qty: 2,
        qtyFulfilled: 0,
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/173536198.png?v=1681492715",
        shop: {
          name: "Myti BigC Games",
          address: "50 Lakeside Avenue, Burlington, VT 05401",
        },
      },
      {
        // title: "ATAT Darth Vader Earbuds",
        title: "ATAT Darth Vader Earbuds - Black",
        lineItemId: 13807502590267,
        qty: 2,
        qtyFulfilled: 1,
        imageSrc:
          "https://cdn.shopify.com/s/files/1/0733/2030/0859/products/118766225.jpg?v=1682007280",
        shop: {
          name: "Mytify Audio",
          address: "50 Lakeside Avenue, Burlington, VT 05401",
        },
      },
    ],
  },
};

test("Can navigate to pickup sheets", async ({ page, pickupSheetsPage }) => {
  await page.goto("/");

  await pickupSheetsPage.nav.click("pickup-sheets");

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);
});

test("Can view pickup sheets", async ({ pickupSheetsPage }) => {
  const expectedOrder = WellKnownOrders.fulfilled;

  await pickupSheetsPage.goto();

  await expect(pickupSheetsPage.page).toHaveTitle(/Pickup Sheets/);

  for (const {
    shop: expectedShop,
    title,
    lineItemId,
    imageSrc,
    qtyFulfilled,
  } of expectedOrder.lineItems) {
    // Shop data
    const shop = pickupSheetsPage.getShop(expectedShop.name);
    await expect(shop.el).toBeVisible();
    await expect(shop.el).toContainText(expectedShop.address);

    // Order
    const order = shop.getOrder(expectedOrder.orderNumber);
    await expect(order.el).toBeVisible();

    // Line item: id, photo, qty, partial fulfillment note
    const lineItem = order.getLineItem(title);
    await expect(lineItem.el).toBeVisible();
    await expect(lineItem.el).toContainText(`Line Item ID: ${lineItemId}`);

    // TODO(benglass): This is failing b/c API is returning the wrong value here
    // skip til we get a fix so we aren't blocked on adopting API
    await expect(lineItem.qty).toHaveText(String(qtyFulfilled));

    await expect(lineItem.img).toHaveAttribute("src", imageSrc);
  }
});

test("Partially fulfilled items show an explanatory note", async ({
  pickupSheetsPage,
}) => {
  const expectedOrder = WellKnownOrders.partiallyFulfilled;
  const expectedLineItems = expectedOrder.lineItems;

  await pickupSheetsPage.goto();

  for (const { title, shop, qty, qtyFulfilled } of expectedLineItems) {
    const partiallyUnfulfilledOrder = pickupSheetsPage
      .getShop(shop.name)
      .getOrder(expectedOrder.orderNumber);

    await expect(partiallyUnfulfilledOrder.el).toBeVisible();

    const lineItem = partiallyUnfulfilledOrder.getLineItem(title);

    await expect(lineItem.qty).toHaveText(String(qtyFulfilled));

    await expect(lineItem.el).toContainText(
      `QTY Ordered: ${qty} (${
        qtyFulfilled === 0 ? "None available" : `Only ${qtyFulfilled} available`
      })`
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
  let pickupSheetsPage: PickupSheetsPage, afterAll: () => Promise<void>;
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    pickupSheetsPage = new PickupSheetsPage(page);
    await pickupSheetsPage.goto();
    await pickupSheetsPage.forPrint();
    afterAll = () => page.close();
  });

  test.afterAll(async () => {
    await afterAll();
  });

  test.skip("Each shop is on its own page", () => {});

  test("Print only boxes are visible", async () => {
    await expect(pickupSheetsPage.initials.first()).toBeVisible();
    await expect(pickupSheetsPage.pickupDate.first()).toBeVisible();
    await expect(pickupSheetsPage.arriveTime.first()).toBeVisible();
    await expect(pickupSheetsPage.departTime.first()).toBeVisible();
  });
});
