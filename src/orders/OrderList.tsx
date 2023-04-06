import { useState } from "react";
import data from '@/data/pilot2-dummy-orders.json';
import MytiView from "./MytiView";
import ByOrderView from "./ByOrderView";
import { LineItem, Order, Shop } from "./model";

const shops = data.shops as unknown as Shop[];
// const shopsById = new Map<number, Shop>(
//   shops.map(s => [s.shopId, s])
// );
const orders = data.orders as unknown as Order[];
// const ordersById = new Map<number, Order>(
//   orders.map(o => [o.orderId, o])
// );
const lineItems = orders.flatMap(o => 
  o.lineItems.map(li => ({ ...li, orderId: o.orderId }))
);

// Convert shop into view model
type LineItemViewModel = LineItem & {
  // shop: ShopViewModel
  // order: OrderViewModel
}

export type ShopViewModel = Shop & {
  // lineItems: LineItemViewModel[]
  orders: OrderViewModel[]
}

export type OrderViewModel = Order & {
  lineItems: LineItemViewModel[]
}

/**
 *
 * Consider reorganizagting view models as follows
 * OrdersViewModel.lineItems is always the way to access line items, never outside an order context
 * Can easily write functions that filter lineItems if we only want certain ones
 * Could even format order to drop soem of the line Items and put it under shop.orders
 * Then shop can have shop.orders rather than needing a line item need a reference to order and shop, you always are in that context
 *  */


const shopsViewModel: ShopViewModel[] = shops.map(shop => {
  const isShopLineItem = (li: LineItem) => li.shopId === shop.shopId;
  const isShopOrder = (o: Order) => o.lineItems.find(isShopLineItem);
  const shopOrders = orders.filter(isShopOrder).map((o: Order) => ({
    ...o,
    lineItems: o.lineItems.filter(isShopLineItem)
  }));
  return {
    ...shop,
    orders: shopOrders,
    lineItems: lineItems
      .filter(isShopLineItem)
      .map(li => ({
        ...li,
        // order: ordersById.get(li.orderId),
        // shop: shopsById.get(li.shopId)
      }))
    };
});

const availableViews = [
  { id: 'by-shop', label: 'By Shop' },
  { id: 'by-order', label: 'By Order' },
];

export function OrderList() {
  const [view, setView] = useState(availableViews[0]);

  return (
    <div className={[view.id].join(' ')}>
      <div className="print:hidden">
        <span className="font-bold p-2">View</span>
        {availableViews.map(_view => (
          <button
            key={_view.id}
            onClick={() => setView(_view)}
            className={`p-2 px-4 m-4 text-white font-bold rounded bg-teal-600 ${_view.id === view.id ? 'bg-teal-800' : ''}`}
          >
            {_view.label}
          </button>
        ))}
      </div>
      <div className="print:hidden flex text-lg text-gray-500">
        <p className="mr-4">
          <strong>Orders:</strong> {orders.length}
        </p>
        <p>
          <strong>Shops:</strong> {shops.length}
        </p>
      </div>
      {view.id === 'by-shop' &&
        <MytiView shops={shopsViewModel} />
      }
      {view.id === 'by-order' &&
        <ByOrderView orders={orders} />
      }
    </div>
  );
}