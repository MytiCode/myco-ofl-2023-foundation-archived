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

type WellKnownOrderKeys = "fulfilled" | "partiallyFulfilled";
export const WellKnownOrders: Record<WellKnownOrderKeys, TestOrder> = {
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
