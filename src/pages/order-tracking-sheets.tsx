import Layout from ":components/Layout";
import { OrderTrackingSheet } from ":orders/order-tracking-sheets/OrderTrackingSheet";
import { OrdersProvider } from ":orders/OrdersProvider";
import { Myco } from ":api/client";

function createShopOrderViewModels({ orders, shops }: { orders: Myco.Order[], shops: Myco.Shop[] }) {
  const shopsById = new Map(
      shops.map(shop => [shop.shopId, shop])
  );

  const shopOrders = orders
    .flatMap(order => {
      return Array.from(
        new Set(order.lineItems.map(li => li.shopId))
      )
        .filter(shopId => shopId !== 0) // TODO(benglass): Remove as soon as api is fixed
        .map(shopId => {
          const shop = shopsById.get(shopId);
          if (!shop) throw new Error(`Could not get shop for shopId ${shopId}`);

          return { order, shop };
        })
        .sort((a, b) => a.shop.name.localeCompare(b.shop.name))
    });

  return shopOrders;
}

export default function OrderTrackingSheetsPage() {
  return (
    <Layout title="Order Tracking Sheets">
      {/* <OrderTrackingSheet shopOrders={shopOrders} /> */}
      <OrdersProvider>
        {({ orders, shops }) => {
          if (!shops || !orders) {
            return <p>Loading...</p>
          }

          const shopOrdersVM = createShopOrderViewModels({ orders, shops });
          return <OrderTrackingSheet shopOrders={shopOrdersVM} />
        }}
      </OrdersProvider>
    </Layout>
  );
}
