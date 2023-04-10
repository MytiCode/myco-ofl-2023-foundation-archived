import { formatDate } from "@/util";
import React from "react";
import { ShopViewModel } from "./OrderList";

export default function MytiView({ shops }: { shops: ShopViewModel[] }) {
  return (
    <div className="">
      {shops.map((shop) => (
        <div key={shop.name} className="p-6 my-4 break-after-page">
          <div className="mb-6 flex">
            <div>
              <h2 className="text-2xl font-bold my-0 mb-2 leading-4">
                {shop.name}
              </h2>
              <h3 className="text-base m-0 font-bold text-slate-500 leading-4 shop-hidden">
                <a
                  href="#"
                  target="_blank"
                  className="text-teal-700 leading-5 font-bold cursor-pointer"
                >
                  {shop.address1}
                  {shop.address2 ? ` ${shop.address2}` : ""}
                  <br />
                  {shop.city}, VT {shop.zip}
                </a>
              </h3>
            </div>
            <div className="ml-auto pl-8 flex shop-hidden">
              <div className="mr-6">
                <div className="text-slate-500 text-xs">Pickup Date</div>
                <div className="border h-8 w-20" />
              </div>
              <div className="mr-6">
                <div className="text-slate-500 text-xs">Arrive Time</div>
                <div className="border h-8 w-20" />
              </div>
              <div className="mr-6">
                <div className="text-slate-500 text-xs">Depart Time</div>
                <div className="border h-8 w-20" />
              </div>
              <div>
                <div className="text-slate-500 text-xs">Initials</div>
                <div className="border h-8 w-20" />
              </div>
            </div>
          </div>
          <table className="border-collapse w-full table-fixed text-sm">
            <thead>
              <tr>
                <th className="w-32 border-b font-medium py-4 p-2 pt-0 pb-3 text-slate-600 text-left">
                  Image
                </th>
                <th className="border-b font-medium py-4 p-2 pt-0 pb-3 text-slate-600 text-left">
                  Description
                </th>
                <th className="w-40 uppercase border-b py-4 p-2 font-medium pt-0 pb-3 text-slate-600 text-left">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {shop.orders.map(order => (
                <React.Fragment key={order.orderId}>
                  {order.lineItems.map((li) => (
                    <tr key={li.lineItemId}>
                      <td className="border-b border-slate-100 py-4 p-2 text-slate-500">
                        {li.imageSrc
                          ? <a href={li.imageSrc} target="_blank">
                              <img src={li.imageSrc} alt={li.title} className="border" />
                            </a>
                          : null
                        }
                      </td>
                      <td className="border-b border-slate-100 py-4 p-2 text-slate-500 align-top leading-4">
                        <a
                          href="#"
                          target="_blank"
                          className="text-base font-bold leading-5 text-teal-700 mb-0 block"
                        >
                          {li.title}
                        </a>
                        <div className="text-slate-400 ">
                          <p className="my-0 leading-5">
                            {Boolean(li.sku) && (
                              <span className="mr-4">
                                <strong className="text-slate-500">SKU:</strong>{" "}
                                {li.sku}
                              </span>
                            )}
                            <span className="shop-hidden">
                              <strong className="text-slate-500">Updated:</strong>{" "}
                              {formatDate(li.updatedAt)}
                            </span>
                          </p>
                          <p className="my-0 leading-5 shop-hidden">
                            <span>
                              <strong className="text-slate-500">
                                Line Item ID:
                              </strong>{" "}
                              {li.lineItemId}
                            </span>
                          </p>
                          <p className="my-0 leading-5 shop-hidden">
                            <strong className="text-slate-500">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}{" "}
                            </strong>
                            <span className="font-normal text-slate-400">
                              {order.shippingAddress.address1}
                              {order.shippingAddress.address2
                                ? ` ${order.shippingAddress.address2}`
                                : ""}
                              , {order.shippingAddress.city}, VT {order.shippingAddress.zip}
                            </span>
                          </p>
                          <p className="my-0 leading-5">
                            <span className="text-slate-500 font-bold">
                              Order {order.orderNumber}
                            </span>{" "}
                            <span className="text-slate-400">
                              {formatDate(order.createdAt)}
                            </span>
                          </p>
                        </div>
                      </td>
                      <td className="text-right border-b border-slate-100 py-4 p-2 text-slate-500 text-2xl align-top">
                        <div className="flex justify-end">
                          <div className="border w-12 shop-hidden" />
                          <span className="font-normal mx-2 shop-hidden">/</span>
                          {li.qty}
                        </div>
                      </td>
                      {/* <pre>{JSON.stringify(li, null, 2)}</pre> */}
                    </tr>
                ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
