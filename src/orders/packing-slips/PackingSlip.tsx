import { LineItemViewModel, OrderViewModel } from ":pages/packing-slips";
import { formatDate } from ":util";
import React from "react";

export default function PackingSlip({ order }: { order: OrderViewModel }) {
  return (
    <div className="p-6 my-4 break-after-page print:m-10" aria-labelledby={`packing-slip-heading-${order.orderId}`} data-type="packing-slip">
      <div className="mb-6 flex">
        <div>
          <h2 className="text-2xl font-bold my-0 mb-2 leading-4" id={`packing-slip-heading-${order.orderId}`}>
            <span className="text-slate-500">{order.orderNumber}</span>
            <span className="ml-2">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </span>
          </h2>
          <h3 className="text-base m-0 font-bold text-slate-500 leading-4">
            <a
              href="#"
              target="_blank"
              className="text-teal-700 leading-5 font-bold cursor-pointer"
            >
              {order.shippingAddress.address1}
              {order.shippingAddress.address2 ? ` ${order.shippingAddress.address2}` : ""}
              , {order.shippingAddress.city}, VT {order.shippingAddress.zip}
              <br />
            </a>
            <span className="text-slate-400 leading-6" aria-label="Date Ordered">
              {formatDate(order.createdAt)}
            </span>
          </h3>
        </div>
        <div className="ml-auto pl-8 hidden print:flex">
          <div>
            <div className="text-slate-500 text-xs">Initials</div>
            <div className="border h-8 w-20" />
          </div>
        </div>
      </div>
      <table className="border-collapse w-full table-fixed text-sm">
        <thead>
          <tr>
            <th className="w-32 border-b font-medium pb-3 pl-0 text-slate-600 text-left">
              Image
            </th>
            <th className="border-b font-medium py-4 p-2 pt-0 pb-3 text-slate-600 text-left">
              Description
            </th>
            <th className="w-20 uppercase border-b py-4 p-2 font-medium pt-0 pb-3 text-slate-600 text-left">
              Qty
            </th>
          </tr>
        </thead>
        {order.shops.map(shop => (
          <tbody aria-labelledby={`shop-tbody-${shop.shopId}`} key={shop.shopId} role="list">
            <tr>
              <td colSpan={3}>
                <h3 className="text-xl font-bold mt-4 my-0 text-slate-500 leading-4" id={`shop-tbody-${shop.shopId}`}>
                  {shop.name}
                </h3>
              </td>
            </tr>
            {shop.lineItems.map((li: LineItemViewModel) => (
              <tr key={li.lineItemId} aria-labelledby={`line-item-row-${li.lineItemId}`} role="listitem">
                <td className="border-b border-slate-100 py-4 p-2 text-slate-500">
                  {li.imageSrc
                    ? <a href={li.imageSrc} target="_blank">
                        <img src={li.imageSrc} alt={li.title} className="border" />
                      </a>
                    : null
                  }
                </td>
                <td className="border-b border-slate-100 py-4 p-2 text-slate-500 align-top leading-4">
                  <span
                    className="text-lg font-bold leading-5 text-teal-700 mb-1 block"
                    id={`line-item-row-${li.lineItemId}`}
                  >
                    {li.title}
                  </span>
                  <div className="text-slate-400 ">
                    <p className="my-0 leading-5">
                      <strong className="text-slate-500">SKU:</strong>{" "}
                      {li.sku}
                    </p>
                      {li.qtyFulfilled != li.qty
                        ? <p className="my-0 leading-5 text-red-800">
                            <strong>QTY Ordered:</strong>{" "}
                            {li.qty} ({li.qtyFulfilled ? `Only ${li.qtyFulfilled} available` : 'None available'})
                          </p>
                        : null
                      }
                  </div>
                </td>
                <td className="border-b border-slate-100 py-4 p-2 text-slate-500 text-2xl align-top">
                  <span aria-label="Quantity Fulfilled">{li.qtyFulfilled}</span>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}
