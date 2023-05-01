import { ShopOrder } from ":pages/order-tracking-sheets";
import { useEffect } from "react";
import { OrderTrackingSheetWriter } from "./OrderTrackingSheetWriter";

export function OrderTrackingSheet({ shopOrders }: { shopOrders: ShopOrder[] }) {
  useEffect(() => {
    const orders = shopOrders.map(({ shop, order }) => [
      order.orderNumber, shop.name, order.status
    ]);

    const lineItems = shopOrders.flatMap(({ shop, order }) => order.lineItems.map(li => [
      order.orderNumber, shop.name, li.title, li.qty, li.qtyFulfilled, li.lineItemId
    ]));

    // TODO: Filename "Order Tracking Sheet – {START_DATE}-{END_DATE}"
    new OrderTrackingSheetWriter().write({
      filename: 'Order Tracking Sheet.xlsx',
      orders,
      lineItems
    });
  }, [shopOrders]);

  return null;
}
