import Layout from ":components/Layout";
import { PickupSheet } from ":orders/pickup-sheets/PickupSheet";
import { Myco } from ":api/client";
import { OrdersProvider } from ":orders/OrdersProvider";
import { isLast } from ":util";

function createShopViewModels({ shops, orders }: { shops: Myco.Shop[], orders: Myco.Order[] }): ShopViewModel[] {
  return shops.map((shop): ShopViewModel => ({
    orders: orders
      .map(o => ({
        ...o,
        lineItems: o.lineItems
          .filter(li => li.shopId === shop.shopId)
          // Won't be picking up cancelled items
          // We are only dealing with READY_FOR_PICKUP orders
          // so awaiting fulfillment is already filtered out
          .filter(li => li.fulfillmentStatus !== 'CANCELLED')
      }))
      .filter(o => o.lineItems.length),
      ...shop,
  }))
  .filter(shop => shop.orders.length)
}

export type LineItemViewModel = Myco.OrderLineItem & {
}

export type ShopViewModel = Myco.Shop & {
  orders: OrderViewModel[];
};

export type OrderViewModel = Myco.Order & {
  lineItems: LineItemViewModel[];
}

export default function PickupSheetsPage() {
  return (
    <Layout title="Pickup Sheets">
      <OrdersProvider includeStatus={["READY_FOR_PICKUP"]}>
        {({ orders, shops }) => {
          if (!shops || !orders) {
            return <p>Loading...</p>
          }

          const shopsVM = createShopViewModels({ orders, shops });
          return (
            <>
              {shopsVM.map((shop, index) => (
                <PickupSheet
                  key={shop.shopId}
                  shop={shop}
                  className={!isLast(shopsVM, index) ? 'break-after-page' : ''}
                />
              ))}
            </>
          );
        }}
      </OrdersProvider>
    </Layout>
  );
}
