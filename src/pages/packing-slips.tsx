import Layout from "@/components/Layout";

import { LineItem, Order, Shop } from "../orders/model";
import data from '@/data/pilot2-dummy-orders.json';
import PackingSlip from "@/packing-slips/PackingSlip";

// TODO: Do we need to sort here?
const shops = (data.shops as unknown as Shop[]).sort((a, b) => a.name.localeCompare(b.name));

const orders = (data.orders as unknown as Order[])
  .map(order => {
    const lineItemViewModels =
      order.lineItems
        .map(li => ({
          ...li,
          imageSrc: li.imageSrc ? li.imageSrc.replace('{MAX_WIDTH}', '400') : li.imageSrc,
        }))
        .sort((a, b) => a.title.localeCompare(b.title));

    const shopViewModels = shops
      .map(shop => ({
        ...shop,
        lineItems:
          lineItemViewModels
            .filter(li => li.shopId === shop.shopId)
      }))
      .filter(shop => shop.lineItems.length);

    return {
      ...order,
      lineItems: lineItemViewModels,
      shops: shopViewModels
    };
  })
  .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

export type LineItemViewModel = LineItem & {
  // shop: ShopViewModel
}

type ShopViewModel = Shop & {
  lineItems: LineItemViewModel[];
};

// TODO: Rename these view models specifically to packing slips
export type OrderViewModel = Order & {
  shops: ShopViewModel[];
}

export default function PackingSlipsPage() {
  return (
    <Layout title="Packing Slips">
      {orders.map(o => (
        <PackingSlip key={o.orderId} order={o} />
      ))}
    </Layout>
  );
}