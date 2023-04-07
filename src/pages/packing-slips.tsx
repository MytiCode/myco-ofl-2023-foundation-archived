import Layout from "@/components/Layout";

import { LineItem, Order, Shop } from "../orders/model";
import data from '@/data/pilot2-dummy-orders.json';
import PackingSlip from "@/orders/PackingSlip";

const shops = data.shops as unknown as Shop[];
const shopsById = new Map<number, Shop>(
  shops.map(s => [s.shopId, s])
);
const orders = (data.orders as unknown as Order[])
  .map(order => ({
    ...order,
    lineItems: order.lineItems.map(li => ({
      ...li,
      shop: shopsById.get(li.shopId)! // should really check shop exists.
    }))
  }))

export type LineItemViewModel = LineItem & {
  shop: ShopViewModel
}

type ShopViewModel = Shop;

export type OrderViewModel = Order & {
  lineItems: LineItemViewModel[]
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