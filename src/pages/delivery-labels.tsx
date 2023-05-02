import Layout from ":components/Layout";
import { DeliveryLabel } from ":orders/delivery-labels/DeliveryLabel";
import { chunk } from "lodash";

import { Order } from "../orders/model";
import data from ':data/pilot2-dummy-orders.json';
import { OrdersProvider } from ":orders/OrdersProvider";
import { Myco } from ":api/client";
import { isLast } from ":util";

export type OrderViewModel = Pick<Myco.Order, 'orderId' | 'orderNumber' | 'shippingAddress'>

const labelsPerPage = 4;

export default function DeliveryLabelsPage() {

  return (
    <Layout title="Delivery Labels">
      <OrdersProvider includeStatus={["READY_FOR_PICKUP"]}>
        {({ orders }) => {
          if (!orders) {
            return <p>Loading...</p>
          }

          const pages = chunk(orders, labelsPerPage);
          return (
            <>
              {pages.map((orders, index) => (
                <div key={index} className={`${!isLast(pages, index) ? "print:break-after-page" : ''} print:p-16 print:pb-0`}>
                  {orders.map(o => (
                    <DeliveryLabel key={o.orderId} order={o} />
                  ))}
                </div>
              ))}
            </>
          );
        }}
      </OrdersProvider>
    </Layout>
  );
}
