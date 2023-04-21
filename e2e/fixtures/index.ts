import { Myco } from ":api/client";

type ShippingAddress = Exclude<Myco.Order["shippingAddress"], null>;

type TestOrder = {
  orderNumber: Myco.Order["orderNumber"];
  createdAt: string;
  shippingAddress: Pick<
    ShippingAddress,
    "firstName" | "lastName" | "address1" | "city" | "state" | "zip"
  >;
  lineItems: Array<{
    lineItemId: number;
    title: Myco.OrderLineItem["title"];
    qty: number;
    qtyFulfilled: number;
    sku: string;
    imageSrc: string;
    shop: {
      // TODO: add shopId here and to line items?
      name: Myco.Shop["name"];
      address: string;
    };
  }>;
};

type WellKnownOrderKeys = "fulfilled" | "partiallyFulfilled";

const testAddress = {
  firstName: "Trevor",
  lastName: "Testeroni",
  address1: "327 North Street",
  city: "Winooski",
  state: "VT",
  zip: "05404",
};

export const WellKnownOrders: Record<WellKnownOrderKeys, TestOrder> = {
  fulfilled: {
    orderNumber: "#1031-2",
    shippingAddress: testAddress,
    createdAt: "2023-04-20T16:21:00+00:00",
    lineItems: [
      {
        title: "ATAT 4D Paper Model Kit",
        sku: "MYTBCG-ATAT-4DPMK012",
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
    createdAt: "2023-04-20T16:21:00+00:00",
    shippingAddress: testAddress,
    lineItems: [
      {
        title: "ATAT 4D Paper Model Kit",
        lineItemId: 13807502623035,
        sku: "NOPE",
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
        sku: "TODO:NOPE",
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
