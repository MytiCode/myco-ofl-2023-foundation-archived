import Layout from ":components/Layout";
import { OrderTrackingSheet } from ":orders/order-tracking-sheets/OrderTrackingSheet";
import { Shop, Order } from ":orders/model";
import data from ':data/pilot2-dummy-orders.json';

export type ShopOrder = {
  order: Order;
  shop: Shop;
}

const shops = new Map(
  (data.shops as unknown as Shop[])
    .map(shop => [shop.shopId, shop])
)

const shopOrders = (data.orders as unknown as Order[])
  .flatMap(order => {
    return Array.from(
      new Set(order.lineItems.map(li => li.shopId))
    )
      .map(shopId => {
        const shop = shops.get(shopId);
        if (!shop) throw new Error(`Could not get shop for shopId ${shopId}`);

        return { order, shop };
      })
      .sort((a, b) => a.shop.name.localeCompare(b.shop.name))
  });

// what is the type for the rows that is both order and shop

export default function OrderTrackingSheetsPage() {
  return (
    <Layout title="Order Tracking Sheets">
      <OrderTrackingSheet shopOrders={shopOrders} />
    </Layout>
  );
}
