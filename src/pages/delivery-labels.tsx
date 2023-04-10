import Layout from "@/components/Layout";
import { DeliveryLabel } from "@/delivery-labels/DeliveryLabel";

import { LineItem, Order, Shop } from "../orders/model";
import data from '@/data/pilot2-dummy-orders.json';

const orders = (data.orders as unknown as Order[]);

export type OrderViewModel = Pick<Order, 'orderId' | 'orderNumber' | 'shippingAddress'>

export default function DeliveryLabelsPage() {
  return (
    <Layout title="Delivery Labels">
      {orders.map(order => (
        <DeliveryLabel key={order.orderId} order={order} />
      ))}
    </Layout>
  );
}