import { OrderViewModel } from "@/pages/delivery-labels";

const labelIds = {
  label: (o: { orderId: number }) => `delivery-label-order-${o.orderId}`
}

export function DeliveryLabel({ order }: { order: OrderViewModel }) {
  const { shippingAddress: address } = order;
  return (
      <div aria-labelledby={labelIds.label(order)}>
        <h2 id={labelIds.label(order)}>{order.orderNumber}</h2>
        <img src="something.jpg" alt="Myti: Local is Mighty" />
        <p>
          {address.firstName} {address.lastName}<br />
          {address.address1}{address.address2 ? ', ' + address.address2 : ''},<br />
          {address.city}, {address.stateCode} {address.zip}
        </p>
        <p>Delivered By: </p>
      </div>
  );
}