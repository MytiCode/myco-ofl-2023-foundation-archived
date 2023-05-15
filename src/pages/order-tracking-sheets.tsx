import Layout from ":components/Layout";
import { OrderTrackingSheet } from ":orders/order-tracking-sheets/OrderTrackingSheet";
import { OrdersProvider } from ":orders/OrdersProvider";
import { Myco } from ":api/client";

export type ShopOrder = {
  shop: Myco.Shop;
  order: Myco.Order;
}

function createShopOrderViewModels({ orders, shops }: { orders: Myco.Order[], shops: Myco.Shop[] }): ShopOrder[] {
  const shopsById = new Map(
      shops.map(shop => [shop.shopId, shop])
  );

  const shopOrders = orders
    .flatMap(rawOrder => {
      // One row for each unique shop
      return Array.from(
        new Set(rawOrder.lineItems.map(li => li.shopId))
      )
        .map(shopId => {
          const shop = shopsById.get(shopId);
          if (!shop) throw new Error(`Could not get shop for shopId ${shopId}`);

          // only the line items for that shop
          const order = {
            ...rawOrder,
            lineItems: rawOrder.lineItems.filter(li => li.shopId === shopId)
          };

          return { order, shop };
        })
        .sort((a, b) => a.shop.name.localeCompare(b.shop.name))
    });

  return shopOrders;
}

export default function OrderTrackingSheetsPage() {
  return (
    <Layout title="Order Tracking Sheets">
      <OrdersProvider>
        {({ orders, shops }) => {
          const shopOrdersVM = createShopOrderViewModels({ orders, shops });
          return <OrderTrackingSheet shopOrders={shopOrdersVM} />
        }}
      </OrdersProvider>
    </Layout>
  );
}
