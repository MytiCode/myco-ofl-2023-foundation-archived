import { LineItemViewModel } from "@/pages/packing-slips";
import { OrderViewModel, ShopViewModel } from "@/pages/pickup-sheets";
import { formatDate } from "@/util";

const labelIds = {
  shop: (shop: ShopViewModel) => `pickup-sheet-shop-label-${shop.shopId}`,
  order: (order: OrderViewModel) => `pickup-sheet-order-label-${order.orderId}`,
  lineItem: (lineItem: LineItemViewModel) => `pickup-sheet-line-item-label-${lineItem.lineItemId}`,
}

export function PickupSheet({ shop }: { shop: ShopViewModel }) {
  return (
    <div className="p-6 my-4 break-after-page print:m-10" aria-labelledby={labelIds.shop(shop)}>
      <div className="mb-6 flex">
        <div>
          <h2 className="text-2xl font-bold my-0 mb-2 leading-4" id={labelIds.shop(shop)}>
            {shop.name}
          </h2>
          <p className="text-base m-0 text-teal-700 leading-5 font-bold cursor-pointer">
            {shop.address1}{shop.address2 ? ` ${shop.address2}` : ''}, {shop.city}, {shop.stateCode} {shop.zip}
          </p>
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
        {shop.orders.map(o => (
          <tbody aria-labelledby={labelIds.order(o)} key={o.orderId}>
            <tr>
              <td colSpan={3}>
                <h3 className="text-xl font-bold mt-4 my-0 text-slate-500 leading-4" id={labelIds.order(o)}>
                  <span className="text-xl font-bold text-slate-500">{o.orderNumber}</span>
                </h3>
              </td>
            </tr>
            {o.lineItems.map(li => (
              <tr key={li.lineItemId} aria-labelledby={labelIds.lineItem(li)}>
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
                    id={labelIds.lineItem(li)}
                  >
                    {li.title}
                  </span>
                  <div className="text-slate-400 ">
                    <p className="my-0 leading-5">
                      <span className="text-slate-500">Line Item ID: </span>
                      {li.lineItemId}
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
                <td className="text-right border-b border-slate-100 py-4 p-2 text-slate-500 text-2xl align-top">
                  <div className="flex justify-end">
                    <div className="border w-12" />
                    <span className="font-normal mx-2">/</span>
                    <span aria-label="Quantity Ordered">{li.qty}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}