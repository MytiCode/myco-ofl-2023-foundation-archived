import Layout from ":components/Layout";
import { PickupSheet } from ":orders/pickup-sheets/PickupSheet";
import { LineItem, Order, Shop } from ":orders/model";
import data from ':data/pilot2-dummy-orders.json';

const orders = (data.orders as unknown as Order[])
  .map(order => {
    const lineItemViewModels =
      order.lineItems
        .map(li => ({
          ...li,
          // TODO: This should be centralized? Or pushed down to image rendering
          imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

    return {
      ...order,
      lineItems: lineItemViewModels,
    };
  })
  // .slice(0, 10)
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

// TODO: Do we need to sort here?
const shops = (data.shops as unknown as Shop[])
  .map((shop): ShopViewModel => ({
    orders: orders
      .map(o => ({
        ...o,
        lineItems: o.lineItems.filter(li => li.shopId === shop.shopId)
      }))
      .filter(o => o.lineItems.length),
    ...shop,
  }))
  .filter(shop => shop.orders.length)
  .sort((a, b) => a.name.localeCompare(b.name))

export type LineItemViewModel = LineItem & {
}

export type ShopViewModel = Shop & {
  orders: OrderViewModel[];
};

export type OrderViewModel = Order & {
  lineItems: LineItemViewModel[];
}

export default function PickupSheetsPage() {
  return (
    <Layout title="Pickup Sheets">
      {shops.map(shop => (
        <PickupSheet key={shop.shopId} shop={shop} />
      ))}
    </Layout>
  );
}
