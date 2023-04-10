import Layout from "@/components/Layout";
import { PickupSheet } from "@/pickup-sheets/PickupSheet";
import { LineItem, Order, Shop } from "../orders/model";
import data from '@/data/pilot2-dummy-orders.json';

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
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

// TODO: Do we need to sort here?
const shops = (data.shops as unknown as Shop[])
  .map((shop): ShopViewModel => ({
    orders: orders.filter(o => o.lineItems.find(li => li.shopId === shop.shopId)),
    ...shop,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

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