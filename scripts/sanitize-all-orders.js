const fs = require("fs");

const rawOrders = JSON.parse(
  fs.readFileSync(__dirname + "/../work/all-orders.json").toString()
);

// Remove personal information of real customers
const lineItems = rawOrders.line_items.map((li) => ({
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

const orders = Object.values(
  lineItems.reduce((orders, li) => {
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

const shops = Object.values(
  lineItems.reduce((shops, li) => {
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
        directions_url: `https://www.google.com/maps/dir//${encodeURIComponent(
          `${address1}${address2 ? ` ${address2}` : ""}, ${city}, VT ${zip}`
        )}`,
        line_items: [],
      };
    }

    shops[name].line_items.push(li);

    return shops;
  }, {})
).sort((a, b) => a.name.localeCompare(b.name));

fs.writeFileSync(
  __dirname + "/../src/data/pilot2-dummy-orders.json",
  JSON.stringify({ orders, shops }, null, 2)
);
