import { LineItemViewModel } from "@/pages/packing-slips";
import { OrderViewModel, ShopViewModel } from "@/pages/pickup-sheets";

const labelIds = {
  shop: (shop: ShopViewModel) => `pickup-sheet-shop-label-${shop.shopId}`,
  order: (order: OrderViewModel) => `pickup-sheet-order-label-${order.orderId}`,
  lineItem: (lineItem: LineItemViewModel) => `pickup-sheet-line-item-label-${lineItem.lineItemId}`,
}

export function PickupSheet({ shop }: { shop: ShopViewModel }) {
  return (
    <div aria-labelledby={labelIds.shop(shop)}>
      <h2 id={labelIds.shop(shop)}>{shop.name}</h2>
      <p>{shop.address1}{shop.address2 ? ` ${shop.address2}` : ''}, {shop.city}, {shop.stateCode} {shop.zip}</p>
      {shop.orders.map(o => (
        <div aria-labelledby={labelIds.order(o)} key={o.orderId}>
          <h3 id={labelIds.order(o)}>{o.orderNumber}</h3>
          {o.lineItems.map(li => (
            <div aria-labelledby={labelIds.lineItem(li)} key={li.lineItemId}>
              <h4 id={labelIds.lineItem(li)}>{li.title}</h4>
              <p>
                <span aria-label="QTY Ordered">{li.qty}</span>
                <span>Line Item ID: {li.lineItemId}</span>
              </p>
              {li.imageSrc
                ? <img src={li.imageSrc} alt={li.title} />
                : null
              }
              {li.qtyFulfilled != li.qty
                ? <p className="my-0 leading-5 text-red-800">
                    <strong>QTY Ordered:</strong>{" "}
                    {li.qty} ({li.qtyFulfilled ? `Only ${li.qtyFulfilled} available` : 'None available'})
                  </p>
                : null
              }
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}