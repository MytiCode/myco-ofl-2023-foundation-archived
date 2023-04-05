import { useState } from "react";
import data from '@/data/pilot2-dummy-orders.json';
import MytiView from "./MytiView";
import ByOrderView from "./ByOrderView";
import { Order, Shop } from "./model";

const shops = data.shops as unknown as Shop[];
const orders = data.orders as unknown as Order[];

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
        <MytiView shops={shops} />
      }
      {view.id === 'by-order' &&
        <ByOrderView orders={orders} />
      }
    </div>
  );
}