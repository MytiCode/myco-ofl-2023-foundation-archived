const labelIds = {
  label: (o: { orderId: number }) => `delivery-label-order-${o.orderId}`
}

export function DeliveryLabel() {
  return (
      <div aria-labelledby={labelIds.label({ orderId: 1 })}>
        <h2 id={labelIds.label({ orderId: 1 })}>#1226-2</h2>
        <img src="something.jpg" alt="Myti: Local is Mighty" />
        <p>
          Nobody Jones<br />
          9999 Excellent Drive, Apt 1,<br />
          Burlington, VT 05401
        </p>
        <p>Delivered By: </p>
      </div>
  );
}