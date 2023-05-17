import { ShopOrder } from ":pages/order-tracking-sheets";
import { useEffect } from "react";
import { OrderTrackingSheetWriter } from "./OrderTrackingSheetWriter";
import { Myco } from ":api/client";
import { DateTime } from "luxon";

export function OrderTrackingSheet({ shopOrders, shops }: { shopOrders: ShopOrder[], shops: Myco.Shop[] }) {
  useEffect(() => {
    const orders = shopOrders.map(({ shop, order }) => [
      order.orderNumber, shop.name, order.status
    ]);

    const lineItems = shopOrders.flatMap(({ shop, order }) => order.lineItems.map(li => [
      order.orderNumber, shop.name, li.title, li.fulfillmentStatus, li.qty, li.qtyFulfilled, li.lineItemId
    ]));

    const shopsRows = shops.map(({ name, address }) => [
      name,
      `${address.address1}${address.address2 ? ` ${address.address2}` : ''}, ${address.city}, ${address.state} ${address.zip}`
    ]);

    const humanDateTime = DateTime.now().toFormat('yyyy-LL-dd-hh-mm-a');
    const filename = `Order Tracking Sheet - ${humanDateTime}.xlsx`;
    new OrderTrackingSheetWriter().write({
      filename,
      orders,
      shops: shopsRows,
      lineItems
    });
  }, [shopOrders, shops]);

  return null;
}
