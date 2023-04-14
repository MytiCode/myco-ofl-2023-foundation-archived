import Layout from ":components/Layout";
import { DeliveryLabel } from ":orders/delivery-labels/DeliveryLabel";
import { chunk } from "lodash";

import { Order } from "../orders/model";
import data from ':data/pilot2-dummy-orders.json';

const orders = (data.orders as unknown as Order[]);

export type OrderViewModel = Pick<Order, 'orderId' | 'orderNumber' | 'shippingAddress'>

const labelsPerPage = 4;

export default function DeliveryLabelsPage() {
  const pages = chunk(orders, labelsPerPage);

  return (
    <Layout title="Delivery Labels">
      {pages.map((orders, index) => (
        <div key={index} className="print:break-after-page print:p-10">
          {orders.map(order => (
            <DeliveryLabel key={order.orderId} order={order} />
          ))}
        </div>
      ))}
    </Layout>
  );
}
