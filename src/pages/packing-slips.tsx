import Layout from ":components/Layout";
import PackingSlip from ":orders/packing-slips/PackingSlip";
import { OrdersProvider } from ":orders/OrdersProvider";
import { Myco } from ":api/client";
import { isLast } from ":util";

function createOrderViewModels({ orders, shops }: { orders: Myco.Order[], shops: Myco.Shop[] }) {
  return orders
    .map(order => {
      const { lineItems } = order;
      const shopViewModels = shops
        .map(shop => ({
          ...shop,
          lineItems: lineItems
            .filter(li => li.shopId === shop.shopId)
        }))
        .filter(shop => shop.lineItems.length);

      return {
        ...order,
        shops: shopViewModels
      };
    });
}

export type LineItemViewModel = Myco.OrderLineItem & {
}

type ShopViewModel = Myco.Shop & {
  lineItems: LineItemViewModel[];
};

export type OrderViewModel = Myco.Order & {
  shops: ShopViewModel[];
}

export default function PackingSlipsPage() {
  return (
    <Layout title="Packing Slips">
      <OrdersProvider includeStatus={["READY_FOR_PICKUP"]}>
        {({ orders, shops }) => {
          const orderVMs = createOrderViewModels({ orders, shops });
          return (
            <>
              {orderVMs.map((o, index) => (
                <PackingSlip
                  key={o.orderId}
                  order={o}
                  className={!isLast(orderVMs, index) ? 'break-after-page' : undefined}
                />
              ))}
            </>
          );
        }}
      </OrdersProvider>
    </Layout>
  );
}
