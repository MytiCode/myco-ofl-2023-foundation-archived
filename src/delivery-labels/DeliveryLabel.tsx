import { OrderViewModel } from "@/pages/delivery-labels";
import mytiLogo from '../../public/myti-logo-delivery-labels.png';
import Image from 'next/image'

const labelIds = {
  label: (o: { orderId: number }) => `delivery-label-order-${o.orderId}`
}

export function DeliveryLabel({ order }: { order: OrderViewModel }) {
  const { shippingAddress: address } = order;
  return (
      <div aria-labelledby={labelIds.label(order)} className="flex items-center mb-10">
        <div className="w-40 mr-4">
          <Image src={mytiLogo} alt="Myti: Local is Mighty" />
        </div>
        <div>
          <h2
            className="text-2xl text-slate-600 font-bold mb-2"
            id={labelIds.label(order)}
          >
            Order {order.orderNumber}
          </h2>
          <p>
            {address.firstName} {address.lastName}<br />
            {address.address1}{address.address2 ? ', ' + address.address2 : ''},<br />
            {address.city}, {address.stateCode} {address.zip}
          </p>
          <p className="mt-3">
            <strong className="font-bold uppercase">Delivered By:</strong>
          </p>
        </div>
      </div>
  );
}