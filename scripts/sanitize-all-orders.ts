import { LineItem, Order, Shop } from "@/orders/model";
import assert from "assert";
import fs from "fs";

const rawOrders = JSON.parse(
  fs.readFileSync(__dirname + "/../work/all-orders.json").toString()
);

// Remove personal information of real customers
const lineItems = rawOrders.line_items.map((li: any) => ({
  ...li,
  billing_address1: "9999 Excellent Drive",
  billing_first_name: "Nobody",
  billing_last_name: "Jones",
  shipping_address1: "9999 Excellent Drive",
  shipping_first_name: "Nobody",
  shipping_last_name: "Jones",
  email: "nobody@myti.com",
  phone: "+1 555-555-5555",
  billing_longitude: -73.212361,
  billing_latitude: 44.473802,
}));

const rawOrdersV2 = Object.values(
  lineItems.reduce((orders: any, li: any) => {
    const {
      order_id,
      order_number,
      created_at,
      shipping_first_name,
      shipping_last_name,
      shipping_address1,
      shipping_address2,
      shipping_city,
      shipping_zip,
      email,
      phone,
      ...line_item
    } = li;
    if (!orders[order_id]) {
      const o = {
        id: order_id,
        order_number,
        created_at,
        shipping_first_name,
        shipping_last_name,
        shipping_address1,
        shipping_address2,
        shipping_city,
        shipping_zip,
        email,
        phone,
        line_items: [],
      };
      orders[order_id] = o;
    }

    orders[order_id].line_items.push({
      ...line_item,
      id: line_item.line_item_id,
    });

    return orders;
  }, {})
);

const rawShops = Object.values(
  lineItems.reduce((shops: any, li: any) => {
    const {
      shop_name: name,
      shop_zip: zip,
      shop_city: city,
      shop_address1: address1,
      shop_address2: address2,
    } = li;
    if (!shops[name]) {
      shops[name] = {
        name,
        city,
        zip,
        address1,
        address2,
        line_items: [],
      };
    }

    shops[name].line_items.push(li);

    return shops;
  }, {})
).sort((a: any, b: any) => a.name.localeCompare(b.name));

const getId = (() => {
  let lastId = 0;
  return function _getId() {
    lastId++;
    return lastId;
  };
})();

function transformShop(shop: any): Shop {
  return {
    shopId: getId(),
    name: shop.name,
    address1: shop.address1,
    address2: shop.address2,
    city: shop.city,
    zip: shop.zip,
    state: "Vermont",
    stateCode: "VT",
  };
}

const shops = rawShops.map(transformShop);
const shopNameToId = shops.reduce(
  (_shopNameToId: Map<string, number>, shop: Shop) => {
    _shopNameToId.set(shop.name, shop.shopId);
    return _shopNameToId;
  },
  new Map<string, number>()
);

function transformLineItem(lineItem: any): LineItem {
  const shopId = shopNameToId.get(lineItem.shop_name);
  assert(
    typeof shopId === "number",
    `Could not get shopId for vendor "${lineItem.shop_name}"`
  );

  return {
    lineItemId: lineItem.id,
    title: lineItem.name,
    price: lineItem.price,
    imageSrc: lineItem.image_src,
    shopId,
    sku: lineItem.sku,
    qty: lineItem.qty,
  };
}

function transformOrder(order: any): Order {
  return {
    orderId: order.id,
    orderNumber: order.order_number,
    billingAddress: null,
    // billingAddress: {
    //   address1: order.billing_address1,
    //   address2: order.billing_address2,
    //   city: order.billing_city,
    //   zip: order.billing_zip,
    //   state: order.billing_state,
    //   stateCode: "VT",
    //   firstName: order.billing_first_name,
    //   lastName: order.billing_last_name,
    // },
    shippingAddress: {
      address1: order.shipping_address1,
      address2: order.shipping_address2,
      city: order.shipping_city,
      zip: order.shipping_zip,
      state: order.shipping_state,
      stateCode: "VT",
      firstName: order.shipping_first_name,
      lastName: order.shipping_last_name,
    },
    contact: {
      phone: order.phone,
      email: order.email,
    },
    createdAt: order.created_at,
    price: order.price,
    tax: order.tax,
    subtotal: order.price - order.tax,
    lineItems: order.line_items.map(transformLineItem),
  };
}

const orders = rawOrdersV2.map(transformOrder);

// console.log(JSON.stringify({ orders, shops }, null, 2));

// process.exit(0);

fs.writeFileSync(
  __dirname + "/../src/data/pilot2-dummy-orders.json",
  JSON.stringify({ orders, shops }, null, 2)
);
